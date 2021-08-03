function strLimiter(str) {
    const trimmedString = str.substring(0, 25);
    return trimmedString;
}

function renderResults(data, params) {
    const hits = data.data.hits.hits;
    hits.forEach((hit) => {
        const { author, title, concepts, date, link } = {...hit._source };
        let keywords = concepts.slice(0, 3).join(" ");
        const append = `
    <li>
    <p>
    <a href="${link}" target="_blank">
    ${title}
    </a>
    </p>
    <span class="left" id="author">${strLimiter(author)}
    </span>
    <span id="keywords" class="right">
    ${keywords}
    </span>
    </li>`;
        const element = $("#list-results");
        element.append(append);
    });
    $(".pagination").show();
    console.log(params)
    $('#current').text(params.pg || 1);

}

function fetchData(params) {
    const element = $("#query");
    element.val(params.q);
    fetch(
            `http://localhost:8080/api/search?queryString=${params.q}&&page=${params.pg}`
        )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            renderResults(data, params);
        });
}

$(document).ready(function() {
    console.log("ready!");
    $(".pagination").hide();
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.q) {
        // pagination
        let currentPage = params.pg ? +params.pg : 1;


        $("#previous").on("click", function(evt) {
            console.log("Clicked previous");
            let previousPage = currentPage > 1 ? currentPage - 1 : currentPage;
            previousPage = `http://localhost:8080/?q=${params.q}&&pg=${
      previousPage
      }`;
            window.location.href = previousPage;

        });

        $("#next").on("click", function(evt) {
            console.log("Clicked next");
            const nextPage = `http://localhost:8080/?q=${params.q}&&pg=${
        currentPage + 1
      }`;
            window.location.href = nextPage;
        });
        fetchData(params);
    }
});