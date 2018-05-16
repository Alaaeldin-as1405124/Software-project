//changing the content by clicking on nav bar

async function onRenewReg() {
    document.querySelector('#contentDiv').innerHTML = await getPage('renew-registeration.html');
}

async function onTransferOwnership() {
    document.querySelector('#contentDiv').innerHTML = await getPage('transfer-ownership.html');
}

async function onReportAccident() {
    document.querySelector('#contentDiv').innerHTML = await getPage('report-accident.html');
}


//functions which communicate with the server to get/post the data
async function onRenew(data) {
    event.preventDefault();
    //get all form data
    let form = convertForm2JSON(data);
    let fetchResponse = await fetch(`/api/vehicle/renew/${form.vin}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    });
    let response = await fetchResponse.text();
    alert(response);
}

async function onTransferOwner(data) {
    //alert("clicked")
    event.preventDefault();
    //get all form data
    let form = convertForm2JSON(data);
    if (!form.vin || !form.pQID || !form.nQID){
        alert("Please fill all fields");
        return;
    }
    let fetchResponse = await fetch(`/api/vehicle/transfer/${form.vin}/${form.pQID}/${form.nQID}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    });
    let response = await fetchResponse.text();
    alert(response)


}

async function onReport(data) {
    //alert("clicked")
    event.preventDefault();
    //get all form data
    let form = convertForm2JSON(data);
    if (!form.vin || !form.victimVin || !form.date || !form.time || !form.desc ){
        alert("Please fill all fields");
        return;
    }
    let fetchResponse = await fetch(`/api/vehicle/reportAccident/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(form)
    });
    let response = await fetchResponse.text();
    alert(response)


}


//helper methods
async function getPage(PageName) {
    //Get html content of each page by its name
    const page = await fetch(PageName);
    return page.text();
}

function convertForm2JSON(form) {
    const formData = new FormData(form);
    let data = {};
    for (let [key, value] of formData) {
        data[key] = value;
    }
    return data;
}