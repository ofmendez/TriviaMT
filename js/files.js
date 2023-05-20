    export function loadViewFile(viewFile) {
        return new Promise((resolve,reject)=>{
            fetch("./HTML/"+viewFile+".html")
            .then((response) => response.text())
            .then((textView) => resolve(textView) );
        });
    }
