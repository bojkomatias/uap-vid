#!/bin/bash

# Variables (modify these as needed)
USERNAME="github_user"
HOMEDIR="/home/nodo"
SSH_DIR="$HOMEDIR/.ssh"
SSH_KEY="$SSH_DIR/id_rsa"

# Step 1: Check if the user already exists
if id "$USERNAME" &>/dev/null; then
    echo "User '$USERNAME' already exists."
else
    # Create the new user without a home directory
    sudo useradd -M -d "$HOMEDIR" -s /bin/bash "$USERNAME"
    echo "User '$USERNAME' created."
fi

# Step 2: Ensure the .ssh directory exists with correct permissions
if [ ! -d "$SSH_DIR" ]; then
    sudo mkdir -p "$SSH_DIR"
    sudo chmod 700 "$SSH_DIR"
    sudo chown "$USERNAME":"$USERNAME" "$SSH_DIR"
    echo ".ssh directory created at '$SSH_DIR'."
else
    echo ".ssh directory already exists at '$SSH_DIR'."
fi

# Step 3: Generate SSH key pair for the new user if it doesn't exist
if [ ! -f "$SSH_KEY" ]; then
    sudo -u "$USERNAME" ssh-keygen -t rsa -b 4096 -f "$SSH_KEY" -N ""
    sudo chown "$USERNAME":"$USERNAME" "$SSH_KEY" "$SSH_KEY.pub"
    sudo chmod 600 "$SSH_KEY"
    sudo chmod 644 "$SSH_KEY.pub"
    echo "SSH key pair generated for user '$USERNAME'."
else
    echo "SSH key pair already exists at '$SSH_KEY'."
fi

# Step 4: Ensure the public key is in authorized_keys
if [ ! -f "$SSH_DIR/authorized_keys" ]; then
    sudo touch "$SSH_DIR/authorized_keys"
    sudo chmod 600 "$SSH_DIR/authorized_keys"
    sudo chown "$USERNAME":"$USERNAME" "$SSH_DIR/authorized_keys"
fi

if ! grep -q "$(cat $SSH_KEY.pub)" "$SSH_DIR/authorized_keys"; then
    sudo cat "$SSH_KEY.pub" | sudo tee -a "$SSH_DIR/authorized_keys" > /dev/null
    echo "Public key added to authorized_keys."
else
    echo "Public key already exists in authorized_keys."
fi

# Step 5: Ensure the user has write access to /home/nodo
sudo chown -R "$USERNAME":"$USERNAME" "$HOMEDIR"
sudo chmod -R 755 "$HOMEDIR"
echo "Write access to '$HOMEDIR' ensured for user '$USERNAME'."

# Step 6: Add user to Docker group
if ! groups "$USERNAME" | grep -q "docker"; then
    sudo usermod -aG docker "$USERNAME"
    echo "User '$USERNAME' added to Docker group."
else
    echo "User '$USERNAME' is already in the Docker group."
fi

# Step 7: Configure password-less sudo for Docker commands
echo "$USERNAME ALL=(ALL) NOPASSWD: /usr/bin/docker" | sudo tee /etc/sudoers.d/$USERNAME-docker

echo "Setup complete."

# Print SSH private key for GitHub secrets
echo "Copy and paste the following SSH private key into your GitHub secrets:"
sudo cat "$SSH_KEY"