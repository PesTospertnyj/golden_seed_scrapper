const insert = require("../database/postgres/insert");
const chrome = require('selenium-webdriver/chrome');
const config = require('../config/config')

const screen = {
    width: 1920,
    height: 1080
};

const {Builder, By, Key, until} = require('selenium-webdriver');
const maxWait = 20000
const severities = ['Light', 'Average', 'Severe']

exports.selenium = async () => {
    let driver = new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless().windowSize(screen)).build();
    try {
        await driver.get(config.config.SCRAPPING_URL);

        let accept = await driver.wait(
            until.elementLocated(By.xpath(`//*[@id='popmake-130']/button`)),
            maxWait
        );

        await driver.wait(
            until.elementIsVisible(accept),
            maxWait
        );

        await driver.findElement(By.xpath(`//*[@id='popmake-130']/button`)).click();

        let purposeOfUse = await driver.wait(
            until.elementLocated(By.xpath(`//*[@id="ezfc_element-646-0"]`)),
            maxWait
        );

        await driver.wait(
            until.elementIsVisible(purposeOfUse),
            maxWait
        );

        await driver.findElement(By.xpath(`//*[@id="ezfc_element-646-0"]`)).click();

        let payload = await driver.findElement(By.xpath(`//*[@id="ezfc_element-648-child"]`)).getText();
        let diseases = payload.split("\n")

        for (let disease = 0; disease < diseases.length; disease++) {
            await driver.findElement(By.xpath(`//*[@id="ezfc_element-648-child"]`)).sendKeys(diseases[disease]);
            await driver.sleep(1000)
            let element
            try {
                element = await driver.findElement(By.xpath(`//*[@id="ezfc_element-649-child"]`)).getText();
            } catch (e) {

            }
            console.log(element);
                if (element === "") {
                let dataList = await process(driver);
                let list = await parseData(dataList);

                for (let i = 0; i < list.length; i++) {
                    await insert.insert(diseases[disease], list[i].weight, list[i].stepOneDosage, list[i].stepTwoDosage, list[i].stepThreeDosage)
                    console.log('Inserted:\n', diseases[disease], list[i].weight, list[i].stepOneDosage, list[i].stepTwoDosage, list[i].stepThreeDosage)

                }
            } else {
                for (let severeId = 0; severeId < 3; severeId++) {
                    await driver.findElement(By.xpath(`//*[@id="ezfc_element-649-child"]`)).sendKeys(severities[severeId]);
                    let dataList = await process(driver, severeId);
                    let list = await parseData(dataList);
                    for (let i = 0; i < list.length; i++) {
                        await insert.insert(diseases[disease], list[i].weight, list[i].stepOneDosage, list[i].stepTwoDosage, list[i].stepThreeDosage, severities[severeId])
                        console.log('Inserted:\n', diseases[disease], list[i].weight, list[i].stepOneDosage, list[i].stepTwoDosage, list[i].stepThreeDosage, severities[severeId])
                    }
                }
            }
        }
    } finally {
        await driver.quit();
    }
}

async function process(driver) {
    let list = []

    for (let weight = 1; weight < 441; weight++) {
        let element = await driver.findElement(By.xpath(`//*[@id="ezfc_element-653-child"]`))
        await element.clear();
        await element.sendKeys(weight);

        let stepOneDosageWaiter = await driver.wait(
            until.elementLocated(By.xpath(`//*[@id="ezfc_element-669-child"]`)),
            maxWait
        );

        await driver.wait(
            until.elementIsVisible(stepOneDosageWaiter),
            maxWait
        );

        let stepTwoDosageWaiter = await driver.wait(
            until.elementLocated(By.xpath(`//*[@id="ezfc_element-669-child"]`)),
            maxWait
        );

        await driver.wait(
            until.elementIsVisible(stepTwoDosageWaiter),
            maxWait
        );

        let stepThreeDosageWaiter = await driver.wait(
            until.elementLocated(By.xpath(`//*[@id="ezfc_element-669-child"]`)),
            maxWait
        );

        await driver.wait(
            until.elementIsVisible(stepThreeDosageWaiter),
            maxWait
        );

        let stepOneDosage = await driver.findElement(By.xpath(`//*[@id="ezfc_element-669-child"]`)).getAttribute('value')
        let stepTwoDosage = await driver.findElement(By.xpath(`//*[@id="ezfc_element-674-child"]`)).getAttribute('value')
        let stepThreeDosage = await driver.findElement(By.xpath(`//*[@id="ezfc_element-679-child"]`)).getAttribute('value')

        console.log(stepOneDosage, weight);
        console.log(stepTwoDosage, weight);
        console.log(stepThreeDosage, weight, '\n', '----------------------');

        let data = {
            lineStepOneDosage: stepOneDosage,
            lineStepTwoDosage: stepTwoDosage,
            lineStepThreeDosage: stepThreeDosage,
            weight: weight
        };

        list.push(data);
    }

    return list;
}

async function parseData(dataList) {
    let list = [];
    dataList.forEach((element) => {
        let data = {
            stepOneDosage: (element.lineStepOneDosage.split(" ")[0]),
            stepTwoDosage: (element.lineStepTwoDosage.split(" ")[0]),
            stepThreeDosage: (element.lineStepThreeDosage.split(" ")[0]),
            weight: element.weight
        };

        list.push(data);
    });

    return list;
}