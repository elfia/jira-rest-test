  
  function startTest() {
    function testSpinner (domSpinner, domData, option) {
      results.total++;

      var spinner = new Spinner (domSpinner, domData),
        resultSpinner = 'ok',
        resultData = 'ok';

      spinner[option]();

      if (option == 'start') {
        if( domSpinner.style.display != 'block')  {
            resultSpinner = 'not visible';
        } else if (domData.style.visibility != 'hidden') {
            resultData = 'not hidden'         
        }
        
      }

      if (option == 'stop') {
        if( domSpinner.style.display != 'none')  {
            resultSpinner = 'not hidden';
        } else if (domData.style.visibility != 'visible') {
            resultData = 'not visible'         
        }
        
      }

      if (resultSpinner != 'ok' || resultData != 'ok') {
          results.bad++;
          console.log("For option " + option + " - Spinner: " + resultSpinner + " Container under spinner: " + resultData);      
        }
        
    }

    var results = {
      total: 0,
      bad: 0
    };

    testSpinner(document.getElementById('spinnerBugData'), document.getElementById('spinnerData'), 'start');
    testSpinner(document.getElementById('spinnerBugData'), document.getElementById('spinnerData'), 'stop');

    console.log("Of " + results.total + " tests, " + 
      results.bad + " failed, " +
      (results.total - results.bad) + " passed.");

  }
