var md = new showdown.Converter();

var currentPage = "";

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

function hashchanged(){
  var hash = location.hash.replace( /^#/, '' );
  page = findGetParameter("page");
  if (page != undefined && page != null && currentPage != page) {
     $.get(page, function(response){
        $("main").html(md.makeHtml(response));
        htmlTableOfContents();
     })
     currentPage = page;
      
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });
  }
  if (currentPage == "") {
    $("main").load("main.html");
  }
}

window.addEventListener("hashchange", hashchanged, false);


function htmlTableOfContents (documentRef) {
    var documentRef = documentRef || document;
    var toc = documentRef.getElementById('toc');
    var headings = [].slice.call(documentRef.body.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    headings.forEach(function (heading, index) {
        var anchor = documentRef.createElement('a');
        anchor.setAttribute('name', 'toc' + index);
        anchor.setAttribute('id', 'toc' + index);

        var link = documentRef.createElement('a');
        link.setAttribute('href', '#toc' + index);
        link.textContent = heading.textContent;

        var div = documentRef.createElement('li');
     //   div.className = "nav bd-sidenav";
        div.setAttribute('class', "toc-" + heading.tagName.toLowerCase());

        div.appendChild(link);
        toc.appendChild(div);
        heading.parentNode.insertBefore(anchor, heading);
    });
}



//?page=topics/continuous.html
$(function() {
  $.getJSON( "topics/topics.json", function( data ) {
    var items = [];
    $.each( data, function( key, val ) {
      var link = $("<a class=\"nav-link\" href=\"topics/" + val.url +"\">" + val.title + "</a>");
      link.on("click",function(e){
        e.preventDefault();
        location.href = "?page=" + e.target.getAttribute("href","2");
      })
      $( "ul.navbar-nav").append( $("<li class=\"nav-item\">").append(link));
    });
  });
    
  document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });
  });  

  hashchanged();
});
