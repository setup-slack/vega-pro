const q = "cG9zdF9pZD04ODA3OCZ0eXBlPXZpZGVvJnRhZz0lM0N2aWRlbyUyMGNsYXNzJTNEJTIydmlkZW8tanMlMjB2anMtYmlnLXBsYXktY2VudGVyZWQlMjIlMjBjb250cm9scyUyMHByZWxvYWQlM0QlMjJhdXRvJTIyJTIwd2lkdGglM0QlMjI2NDAlMjIlMjBoZWlnaHQlM0QlMjIyNjQlMjIlMjBwb3N0ZXIlM0QlMjJodHRwcyUzQSUyRiUyRm1pbGZudXQuY29tJTJGd3AtY29udGVudCUyRnVwbG9hZHMlMkYyMDI2JTJGMDglMkZKb3JkaW5zd2V0LVN0ZXBtb20tTmVlZHMtQ3VtLi1UeS1IZWxwcy1PdXQtRmlsbFVwTXlNb20tNjQweDM2MC5wbmclMjIlM0UlM0Nzb3VyY2UlMjBzcmMlM0QlMjJodHRwcyUzQSUyRiUyRnR1bGlwdmlkLm5ldCUyRnZpZGVvcyUyRkpvcmRpbnN3ZXQlMjUyMC0lMjUyMFN0ZXBtb20lMjUyME5lZWRzJTI1MjBDdW0uJTI1MjBUeSUyNTIwSGVscHMlMjUyME91dCUyMSUyNTIwLSUyNTIwRmlsbCUyNTIwVXAlMjUyME15JTI1MjBNb21fY29udmVydGVkLm0zdTglMjIlMjB0eXBlJTNEJTIyYXBwbGljYXRpb24lMkZ4LW1wZWdVUkwlMjIlMjAlMkYlM0UlM0MlMkZ2aWRlbyUzRQ==";
try {
    let decoded = "";
    try {
        const utf8Str = decodeURIComponent(atob(q).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        decoded = decodeURIComponent(utf8Str);
    } catch (e) {
        decoded = decodeURIComponent(atob(q));
    }
    console.log("DECODED:", decoded);
    const match = decoded.match(/src="([^"]+\.(m3u8|mp4))"/i) || decoded.match(/src="([^"]+)"/i);
    console.log("MATCH:", match);
} catch(e) {
    console.log("ERROR:", e.message);
}
