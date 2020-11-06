const selenium = require('./selenium/index');

selenium.selenium().then().catch(error => console.log(error));