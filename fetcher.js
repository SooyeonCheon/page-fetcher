const request = require("request");
const fs = require("fs");
const readline = require("readline");

const url = process.argv[2];
const path = process.argv[3];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

request(url, (err, response, body) => {
  if (err) {
    console.log("error: invalid URL");
    rl.close();
    return;
  }

  fs.readFile(path, "utf8", function (err, data) {
    // if (err) {
    //   console.log('Error: No such file or directory');
    //   rl.close();
    //   return;
    // }

    // there is no existing file
    if (!data) {
      fs.writeFile(path, body, (err) => {
        if (err) {
          console.log("error: wrong path");
          rl.close();
          return;
        } else {
          rl.close();
          console.log(
            `Downloaded and saved ${response.headers["content-length"]} bytes to ${path}.`
          );
        }
      });
    }

    // If there is a file already
    if (data) {
      rl.question(
        `The file path already exists. If you want to overwrite it, plase type Y\n`,
        (answer) => {
          if (answer === "Y") {
            console.log("Data will be overwritten. Writing to file...");
            rl.close();
            // OVERWRITE
            fs.writeFile(path, body, (err) => {
              if (err) {
                console.log("error: wrong path");
                rl.close();
                return;
              }

              console.log(
                `Downloaded and saved ${response.headers["content-length"]} bytes to ${path}.`
              );
            });
          } else {
            console.log("Data will not be overwritten.");
            rl.close();

            return;
          }
        }
      );
    }
  });
});
