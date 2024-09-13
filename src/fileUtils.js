function downloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function uploadFile(callback,types = null) {
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = types;
    fileInput.click();

    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file, "utf-8");
        reader.addEventListener("load", function (event) {
            callback(event.target.result);
        });
        reader.addEventListener("error", function (event) {
            alert("Something went wrong...");
        });
    });
}

export { downloadFile, uploadFile };