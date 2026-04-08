pipeline {
agent any
  tools{
    nodejs 'node'
  }


environment {
    EC2_IP = "51.21.128.240"
    MONGO_URI = credentials('mongo-uri')
}

stages {

    stage('Install Dependencies') {
        steps {
            bat 'cd backend && npm install'
        }
    }

    stage('Run Tests') {
        steps {
            bat 'cd backend && npm test'
        }
    }

stage('Prepare Permissions') {
    steps {
        bat """
        C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -Command "& { \
            \$path = 'C:\\Users\\idash\\Downloads\\todo.pem'; \
            icacls.exe \$path /reset; \
            icacls.exe \$path /inheritance:r; \
            icacls.exe \$path /grant:r 'SYSTEM:R'; \
            icacls.exe \$path /grant:r \"\$(\$env:USERNAME):R\"; \
        }"
        """
    }
}

stage('Deploy to EC2') {
    steps {
        bat """
        "C:\\Windows\\System32\\OpenSSH\\ssh.exe" -i "C:\\Users\\idash\\Downloads\\todo.pem" -o StrictHostKeyChecking=no ubuntu@%EC2_IP% "cd todo_application/backend && git pull origin main && npm install && pm2 restart all"
        """
    }
}
    }
}



