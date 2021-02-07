function callApi(){
        var res = UrlFetchApp.fetch("http://api.openweathermap.org/data/2.5/forecast?q=Tokyo&appid=9a4d371b6fc452d3edd2f79b142c8c18&lang=ja&units=metric");
        var results = JSON.parse(res.getContentText());
        var nowWeather = "現在の" + results["name"] + "は" + "です";
        Logger.log(results["list"][0]["weather"][0]["description"]);
      }