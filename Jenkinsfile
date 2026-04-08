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

stage('Deploy to EC2') {
    steps {
        withCredentials([sshUserPrivateKey(credentialsId: 'ec2-key', keyFileVariable: 'PEM')]) {
            bat """
            @echo off
            :: 1. Reset and strip all inherited permissions
            icacls.exe "%PEM%" /reset
            icacls.exe "%PEM%" /inheritance:r
            
            :: 2. Grant Read access ONLY to the System account (S-1-5-18)
            :: This removes the "BUILTIN\\Users" access that is causing the SSH error
            icacls.exe "%PEM%" /grant:r *S-1-5-18:R
            
            :: 3. Run the SSH command
            "C:\\Windows\\System32\\OpenSSH\\ssh.exe" -i "%PEM%" -o StrictHostKeyChecking=no ubuntu@%EC2_IP% "cd todo_application/backend && git pull origin main && npm install && pm2 restart all"
            """
        }
    }
}
    }
}



