var fs = require('fs');
fs.writeFile("create-a-file.txt", "Hey there!", function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 