# aid-app-monorepo

* Deploy a new server https://my.vultr.com/deploy/ 
  * Cloud Compute
  * Seattle
  * Marketplace Apps > Docker > Ubuntu
  * $5/mo
  * Deploy Now
* Ssh into server
  * ssh root@420.69.1312
* Download and install node
  * curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
  * sudo apt-get install -y nodejs
* Log into docker
  * su - docker
* Clone the repo
  * git clone https://github.com/dandelion-community/aid-app-monorepo.git
* cd aid-app-monorepo/src
* npm install
* Create docker image
  * docker build -t example-name/example-application .
* Run docker container
  * docker run -p 80:80 --restart unless-stopped -d example-name/example-application
* Go to 420.69.1312 !
