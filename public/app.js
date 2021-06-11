(function () {
    const requestResponseBox = document.getElementById('request-response');
    const requestPerformanceTestButton = document.getElementById('request-performance-test');

    document.getElementById('register-data').addEventListener('submit', function (e) {
        e.preventDefault();
        const testUrl = document.getElementById('performance-test-url').value;
        requestResponseBox.value = 'Requesting data...';
        requestPerformanceTestButton.disabled = true;
        window.performanceData = null;
        const url = `/api/performance?strategy=mobile&url=${testUrl}`;
        fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            // body: JSON.stringify({}) // body data type must match "Content-Type" header
        })
        .then(res => res.json())
        .then(res => {
            requestPerformanceTestButton.disabled = false;
        
            if(res.hasOwnProperty('error')){
                window.performanceData = null;
            } else {
                window.performanceData = res;
            }
            requestResponseBox.value = JSON.stringify(res);

        }).catch(err=>{
            console.error(err);
            requestResponseBox.value(err);
        });
    });


    document.getElementById('save-register').addEventListener('submit', function (e) {
        e.preventDefault();
        if (!!window.performanceData) {
            saveRegister(window.performanceData.msDate, window.performanceData);
            return;
        }
        alert('no data')
    });

    function saveRegister(name, data) {
        const url = '/api/save/performance/register'
        fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            body: JSON.stringify({
                filename: name,
                data
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
        });
    }


})();
