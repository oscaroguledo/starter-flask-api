## DoWell Proctoring Workflow

This workflow is triggered on two events:
1. When a push is made to the `main` branch.
2. When the workflow is manually dispatched using the `workflow_dispatch` event.

The workflow consists of a single job named `Deploy and Rebuild Containers` with the following steps:

1. **Install SSH Keys for Secure Connection**: Installs the SSH keys required to connect to the remote server. The private key is stored as a GitHub secret and is written to the `~/.ssh/id_rsa` file. The SSH host is added to the `known_hosts` file to avoid prompts during the SSH connection.

2. **Connect to Server, Pull Latest Code, and Rebuild Containers**: This step establishes an SSH connection to the remote server and performs several commands:
   - Navigates to the working directory specified in the GitHub secrets.
   - Checks out the branch of the repository specified in the secrets.
   - Pulls the latest changes from the repository.
   - Builds the Docker containers using the `docker-compose.prod.yml` file.
   - Starts the Docker containers in detached mode using the `docker-compose.prod.yml` file.

   If any of these steps fail, the SSH session will exit immediately and the remaining commands won’t be executed and the workflow is marked as failed.

3. **Cleanup SSH Keys**: This step removes the SSH keys from the runner to ensure they are not left behind after the job completes.