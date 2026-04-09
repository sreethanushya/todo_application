pipeline {
    agent any

    tools {
        nodejs 'node'
    }

    environment {
        EC2_IP = "51.21.128.240"
        MONGO_URI = credentials('mongo-uri')
    }

    stages {

        // =========================
        // 1️⃣ Copy Frontend to Backend
        // =========================
        stage('Copy Frontend to Backend') {
            steps {
                // Copy all frontend files (html, js, css) to backend/public
                bat 'xcopy /E /I /Y frontend\\* backend\\public\\'
            }
        }

        // =========================
        // 2️⃣ Install Backend Dependencies
        // =========================
        stage('Install Backend Dependencies') {
            steps {
                bat 'cd backend && npm install'
            }
        }

        // =========================
        // 3️⃣ Run Backend Tests
        // =========================
        stage('Run Tests') {
            steps {
                bat 'cd backend && npm test'
            }
        }

        // =========================
        // 4️⃣ Deploy to EC2
        // =========================
        stage('Deploy to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-key', keyFileVariable: 'PEM')]) {
                    bat """
                    @echo off
                    :: Fix permissions for PEM
                    icacls.exe "%PEM%" /reset
                    icacls.exe "%PEM%" /inheritance:r
                    icacls.exe "%PEM%" /grant:r *S-1-5-18:R

                    :: SSH and deploy
                    "C:\\Windows\\System32\\OpenSSH\\ssh.exe" -i "%PEM%" -o StrictHostKeyChecking=no ubuntu@%EC2_IP% ^
                    "cd todo_application/backend && git pull origin main && npm install && pm2 restart all"
                    """
                }
            }
        }
    }
}
