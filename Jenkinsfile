pipeline {

    agent any

    stages {
        stage("build"){

            steps{
                echo 'building the application...'
                nodejs('Node-17.0.0'){
                    sh 'npm install'
                }
            }
        }
        stage("test"){

            steps{
                echo 'testing the application...'
            }
        }

        stage("deploy"){

            steps{
                echo 'deploying the application...'
            }
        }
    }


}