#!/bin/bash

LOG_FILE="/var/log/user-data.log"
exec > >(tee -a "$LOG_FILE") 2>&1
exec 2> >(tee -a "$LOG_FILE" >&2)
set -euo pipefail

echo "======== Starting user data script at $(date) ========"

export DEBIAN_FRONTEND=noninteractive

trap 'echo "[ERROR] Script failed at line $LINENO. Check $LOG_FILE for details."; exit 1' ERR

handle_error() {
    echo "[ERROR] Script failed at line $1. Check $LOG_FILE for details."
    exit 1
}
trap 'handle_error $LINENO' ERR

# Utility function to check if a command exists
is_installed() {
    command -v "$1" &> /dev/null
}

# Update packages (safe to run every time)
echo "Updating apt package index..."
apt-get update -y

# Install base tools if not present
install_package() {
    if ! dpkg -s "$1" &>/dev/null; then
        echo "Installing $1..."
        apt-get install -y "$1"
    else
        echo "$1 is already installed."
    fi
}

# Install base tools
for pkg in git vim htop unzip wget build-essential python3-pip curl sysstat software-properties-common gnupg lsb-release; do
    install_package "$pkg"
done

# Install Nginx
install_package nginx
systemctl enable nginx
systemctl start nginx

# Install AWS CLI (universal method)
if ! is_installed aws; then
    echo "Installing AWS CLI..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    rm -rf awscliv2.zip aws
else
    echo "AWS CLI is already installed."
fi

# Install Node.js + npm (latest)
if ! is_installed node || ! is_installed npm; then
    echo "Installing Node.js and npm..."
    curl -fsSL https://deb.nodesource.com/setup_current.x | bash -
    apt-get install -y nodejs
    npm install -g npm@latest
else
    echo "Node.js and npm are already installed."
fi

# Install Certbot + Nginx plugin
install_package certbot
install_package python3-certbot-nginx

# Install Docker
if ! is_installed docker; then
    echo "Installing Docker..."
    apt-get install -y docker.io
    systemctl start docker
    systemctl enable docker
else
    echo "Docker is already installed."
fi

# Add 'ubuntu' user to docker group (if not already in group)
if id -nG ubuntu | grep -qw docker; then
    echo "'ubuntu' user is already in the docker group."
else
    usermod -aG docker ubuntu
    echo "Added 'ubuntu' user to docker group. Logout/login may be required to apply."
fi

# Install Docker Compose v2
if ! is_installed docker-compose; then
    echo "Installing Docker Compose v2..."
    DOCKER_COMPOSE_VERSION="2.24.0"
    curl -SL "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose is already installed."
fi

# 9. MongoDB Setup
echo "Adding MongoDB repository..."
DISTRO_CODENAME=$(lsb_release -cs)

# Fallback from noble to jammy if needed
if [[ "$DISTRO_CODENAME" == "noble" ]]; then
    echo "[INFO] Ubuntu 24.04 (noble) detected – falling back to jammy (22.04) for MongoDB..."
    DISTRO_CODENAME="jammy"
fi

# Clean up previous MongoDB entries
rm -f /etc/apt/sources.list.d/mongodb-org-6.0.list
rm -f /usr/share/keyrings/mongodb-server-6.0.gpg

# Add MongoDB GPG key silently
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | gpg --dearmor | tee /usr/share/keyrings/mongodb-server-6.0.gpg > /dev/null

# Add MongoDB source list
echo "deb [signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg] https://repo.mongodb.org/apt/ubuntu ${DISTRO_CODENAME}/mongodb-org/6.0 multiverse" > /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package list again after adding MongoDB
apt-get update -y

# Install MongoDB if not already installed
if ! systemctl list-units --type=service --all | grep -q mongod.service; then
    echo "Installing MongoDB..."
    apt-get install -y mongodb-org
    systemctl start mongod
    systemctl enable mongod
else
    echo "MongoDB already installed and registered as a service."
fi

# Disable system MongoDB so Docker can run MongoDB container
echo "Stopping system MongoDB to free port 27017 for Docker..."
systemctl stop mongod
systemctl disable mongod

# MongoDB Configuration
if grep -q "bindIp: 0.0.0.0" /etc/mongod.conf; then
    echo "MongoDB already configured to bind on all interfaces."
else
    echo "Configuring MongoDB to bind to 0.0.0.0..."
    sed -i 's/^ *bindIp:.*/  bindIp: 0.0.0.0/' /etc/mongod.conf
    systemctl restart mongod
fi

echo "MongoDB installation and configuration completed."
echo "======== Database user data script completed successfully at $(date) ========"
