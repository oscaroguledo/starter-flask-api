#!/bin/bash

# Define color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Check if an argument is provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}Usage: $0 <environment>${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Intializing ..."

front_url1='http://localhost:4173'
front_url2='http://localhost:5173'
front_url3='http://192.64.86.227:4173'

json_array="[\"$front_url1\", \"$front_url2\", \"$front_url3\"]"

# Check if the system is running Linux
if [ "$(uname)" == "Linux" ]; then
    echo -e "${GREEN}✓${NC} System OS: Linux Detected"
    
    # getting the ip address
    # Get the IP address of the Linux system
    ip_address=$(hostname -I | awk '{print $1}')

    cd backend

    # Check if the variables exist in the .env file
    if grep -q "^FRONTEND_URLS=" .env; then
        # Use double quotes around the variable to ensure it's properly interpreted as a string
        sed -i "s|^FRONTEND_URLS=.*|FRONTEND_URLS=$json_array|" .env
    else
        echo "" >> .env
        echo "FRONTEND_URLS=$json_array" >> .env
    fi


    if grep -q "^MONGO_DB_URI=" .env; then
        sed -i "s/^MONGO_DB_URI=.*/MONGO_DB_URI='mongodb+srv://ayoolaaoloyede:bcfmMesLQFS9i0eO@cluster0.zufcwxa.mongodb.net/proctoring-db?retryWrites=true&w=majority'" .env
    else
        echo "" >> .env
        echo "MONGO_DB_URI='mongodb+srv://ayoolaaoloyede:bcfmMesLQFS9i0eO@cluster0.zufcwxa.mongodb.net/proctoring-db?retryWrites=true&w=majority'" >> .env
    fi
    

    if grep -q "^IP=" .env; then
        sed -i "s/^IP=.*/IP=$ip_address:9092/" .env
    else
        echo "" >> .env
        echo "IP=$ip_address:9092" >> .env
    fi

    if grep -q "^IPDEV=" .env; then
        sed -i "s/^IPDEV=.*/IPDEV=$ip_address:9092/" .env
    else
        echo "IPDEV=$ip_address:9092" >> .env
    fi

    if grep -q "^KAFKA_HOST=" .env; then
        sed -i "s/^KAFKA_HOST=.*/KAFKA_HOST=$ip_address/" .env
    else
        echo "KAFKA_HOST=$ip_address" >> .env
    fi

    if grep -q "^KAFKA_TOPIC=" .env; then
        sed -i "s/^KAFKA_TOPIC=.*/KAFKA_TOPIC=MESSAGES/" .env
    else
        echo "KAFKA_TOPIC=MESSAGES" >> .env
    fi
    cd ..
    echo -e "${GREEN}✓${NC} Created env file for backend"
    # Store the IP address in a .env file
    if grep -q "^KAFKA_HOST=" .env; then
        sed -i "s/^KAFKA_HOST=.*/KAFKA_HOST=$ip_address/" .env
    else
        echo "KAFKA_HOST=$ip_address" >> .env
    fi

    if grep -q "^KAFKA_TOPIC=" .env; then
        sed -i "s/^KAFKA_TOPIC=.*/KAFKA_TOPIC=MESSAGES/" .env
    else
        echo "KAFKA_TOPIC=MESSAGES" >> .env
    fi
    echo -e "${GREEN}✓${NC} Created env kafka"


elif [ "$(expr substr $(uname -s) 1 5)" == "MINGW" ]; then
    echo -e "${GREEN}✓${NC} System OS: Windows Detected"

    # Get the IP address for Windows
    ip_address=$(ipconfig | grep IPv4 | grep -v "127.0.0.1" | awk '{print $NF}')
    num_addresses=$(echo "$ip_address" | wc -l)

    cd backend
    # Check if the variables exist in the .env file
    if grep -q "^FRONTEND_URLS=" .env; then
        # Use double quotes around the variable to ensure it's properly interpreted as a string
        sed -i "s|^FRONTEND_URLS=.*|FRONTEND_URLS=$json_array|" .env
    else
        echo "" >> .env
        echo "FRONTEND_URLS=$json_array" >> .env
    fi

    if grep -q "^MONGO_DB_URI=" .env; then
        sed -i "s/^MONGO_DB_URI=.*/MONGO_DB_URI='mongodb+srv://ayoolaaoloyede:bcfmMesLQFS9i0eO@cluster0.zufcwxa.mongodb.net/proctoring-db?retryWrites=true&w=majority'" .env
    else
        echo "" >> .env
        echo "MONGO_DB_URI='mongodb+srv://ayoolaaoloyede:bcfmMesLQFS9i0eO@cluster0.zufcwxa.mongodb.net/proctoring-db?retryWrites=true&w=majority'" >> .env
    fi

    # Check if the variables exist in the .env file
    if grep -q "^IP=" .env; then
        sed -i "s/^IP=.*/IP=$ip_address:9092/" .env
    else
        echo "" >> .env
        echo "IP=$ip_address:9092" >> .env
    fi

    if grep -q "^IPDEV=" .env; then
        sed -i "s/^IPDEV=.*/IPDEV=$ip_address:9092/" .env
    else
        echo "IPDEV=$ip_address:9092" >> .env
    fi

    if grep -q "^KAFKA_HOST=" .env; then
        sed -i "s/^KAFKA_HOST=.*/KAFKA_HOST=$ip_address/" .env
    else
        echo "KAFKA_HOST=$ip_address" >> .env
    fi

    if grep -q "^KAFKA_TOPIC=" .env; then
        sed -i "s/^KAFKA_TOPIC=.*/KAFKA_TOPIC=MESSAGES/" .env
    else
        echo "KAFKA_TOPIC=MESSAGES" >> .env
    fi
    cd ..
    echo -e "${GREEN}✓${NC} Created env file for backend"
    # Store the IP address in a .env file
    if grep -q "^KAFKA_HOST=" .env; then
        sed -i "s/^KAFKA_HOST=.*/KAFKA_HOST=$ip_address/" .env
    else
        echo "KAFKA_HOST=$ip_address" >> .env
    fi

    if grep -q "^KAFKA_TOPIC=" .env; then
        sed -i "s/^KAFKA_TOPIC=.*/KAFKA_TOPIC=MESSAGES/" .env
    else
        echo "KAFKA_TOPIC=MESSAGES" >> .env
    fi
    echo -e "\e[32m✓\e[0m Created env kafka"

elif [ "$(uname)" == "Darwin" ]; then
    echo -e "${GREEN}✓${NC} System OS: macOS Detected"

    # Check if Node.js is installed
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        echo -e "${RED}✗ Node.js is not installed.${NC} Installing Node.js..."
        brew install node
    else
        echo -e "${GREEN}✓ Node.js is already installed. Skipping installation.${NC}"
    fi

    # Get the IP address for macOS
    ip_address=$(ifconfig | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}')
    echo "$ip_address"
    
    cd backend

    # Check if the variables exist in the .env file
    if grep -q "^FRONTEND_URLS=" .env; then
        # Use double quotes around the variable to ensure it's properly interpreted as a string
        sed -i "s|^FRONTEND_URLS=.*|FRONTEND_URLS=$json_array|" .env
    else
        echo "" >> .env
        echo "FRONTEND_URLS=$json_array" >> .env
    fi

    if grep -q "^MONGO_DB_URI=" .env; then
        sed -i "s/^MONGO_DB_URI=.*/MONGO_DB_URI='mongodb+srv://ayoolaaoloyede:bcfmMesLQFS9i0eO@cluster0.zufcwxa.mongodb.net/proctoring-db?retryWrites=true&w=majority'" .env
    else
        echo "" >> .env
        echo "MONGO_DB_URI='mongodb+srv://ayoolaaoloyede:bcfmMesLQFS9i0eO@cluster0.zufcwxa.mongodb.net/proctoring-db?retryWrites=true&w=majority'" >> .env
    fi

    if grep -q "^KAFKA_HOST=" .env; then
        sed -i "s/^KAFKA_HOST=.*/KAFKA_HOST=$ip_address/" .env
    else
        echo "KAFKA_HOST=$ip_address" >> .env
    fi

    if grep -q "^KAFKA_TOPIC=" .env; then
        sed -i "s/^KAFKA_TOPIC=.*/KAFKA_TOPIC=MESSAGES/" .env
    else
        echo "KAFKA_TOPIC=MESSAGES" >> .env
    fi

    cd ..
    echo -e "${GREEN}✓${NC} Created env file for backend"
    # Store the IP address in a .env file
    if grep -q "^KAFKA_HOST=" .env; then
        sed -i "s/^KAFKA_HOST=.*/KAFKA_HOST=$ip_address/" .env
    else
        echo "KAFKA_HOST=$ip_address" >> .env
    fi

    if grep -q "^KAFKA_TOPIC=" .env; then
        sed -i "s/^KAFKA_TOPIC=.*/KAFKA_TOPIC=MESSAGES/" .env
    else
        echo "KAFKA_TOPIC=MESSAGES" >> .env
    fi
    echo -e "${GREEN}✓${NC} Created env kafka"

else
    echo -e "${RED}Unsupported operating system Detected ${NC}"
    echo -e "${RED}Ensure nodejs and npm are installed manually for your OS ${NC}"
    echo -e "${RED}Ensure .env files are added manually for your OS ${NC}"

fi

#==========================================================================================================
# Check the provided argument
if [ "$1" == "dev" ]; then
    # Check if the network exists
    if ! docker network inspect webnet &> /dev/null; then
        # If the network doesn't exist, create it
        docker network create webnet
    else
        # If the network exists, display a message indicating that it already exists
        echo -e "${YELLOW}Network 'webnet' already exists.${NC}"
    fi

    # biuld docker-compose for development
    docker-compose -f docker-compose.dev.yml build
    # Run docker-compose for development environment
    docker-compose -f docker-compose.dev.yml up
elif [ "$1" == "prod" ]; then
    # Check if the network exists
    if ! docker network inspect webnet &> /dev/null; then
        # If the network doesn't exist, create it
        docker network create webnet
    else
        # If the network exists, display a message indicating that it already exists
        echo -e "${YELLOW}Network 'webnet' already exists.${NC}"
    fi

    # biuld docker-compose for prodcution
    docker-compose -f docker-compose.prod.yml build
    # Run docker-compose for production environment
    docker-compose -f docker-compose.prod.yml up -d
else
    echo -e "${RED}Invalid environment specified. Please use 'dev' or 'prod'.${NC}"
    exit 1
fi