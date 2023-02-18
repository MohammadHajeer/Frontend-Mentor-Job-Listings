// Start Variables
let listsContainer = document.querySelector(".lists");
let filterList = document.querySelector(".filter-list");
let filterListContainer = document.querySelector(".filter-list .filters");
let clearButtonFilters = document.querySelector("button");
// End Variables
// Start Fetching
async function getData(condition) {
  let data = await (await fetch("data.json")).json();
  if (condition) {
    let newData = [];
    let found;
    for (let i = 0; i < data.length; i++) {
      found = true;
      for (let j = 1; j < filterListContainer.attributes.length; j++) {
        let dataName = filterListContainer.attributes[j].name
          .match(/-\w+-/gi)
          .join("")
          .slice(1, -1);

        if (dataName == "languages") {
          let language = filterListContainer.attributes[j].value;

          if (data[i][dataName].indexOf(language) == -1) {
            found = false;
          }
        } else if (dataName == "tools") {
          let tool = filterListContainer.attributes[j].value;

          if (data[i][dataName].indexOf(tool) == -1) {
            found = false;
          }
        } else if (dataName == "role") {
          let role = filterListContainer.attributes[j].value;

          if (data[i][dataName] != role) {
            found = false;
          }
        } else {
          let level = filterListContainer.attributes[j].value;

          if (data[i][dataName] != level) {
            found = false;
          }
        }
      }

      if (found) {
        newData.push(data[i]);
      }
    }
    createData(newData);
  } else {
    createData(data);
  }
}
// End Fetching
// Start Creating Data
function createData(array) {
  listsContainer.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    let list = document.createElement("div");
    list.classList.add("list");
    if (array[i].new && array[i].featured) {
      list.classList.add("on-the-top");
    }

    let description = document.createElement("div");
    description.classList.add("description");

    let img = document.createElement("img");
    img.src = array[i].logo;
    img.alt = array[i].company.toLowerCase() + " image";
    description.appendChild(img);

    let details = document.createElement("div");
    details.classList.add("details");

    let company = document.createElement("div");
    company.classList.add("company");
    company.appendChild(document.createTextNode(array[i].company));

    let spanNew = document.createElement("span");
    spanNew.classList.add("new");
    spanNew.appendChild(document.createTextNode("new"));
    let spanFeatured = document.createElement("span");
    spanFeatured.appendChild(document.createTextNode("featured"));
    spanFeatured.classList.add("featured");
    if (array[i].new && array[i].featured) {
      let p = document.createElement("p");
      p.classList.add("top");
      p.appendChild(spanNew);
      p.appendChild(spanFeatured);
      company.appendChild(p);
    } else if (array[i].new) {
      company.appendChild(spanNew);
    } else if (array[i].featured) {
      company.appendChild(spanFeatured);
    }
    details.appendChild(company);

    let h3 = document.createElement("h3");
    h3.classList.add("position");
    h3.appendChild(document.createTextNode(array[i].position));
    details.appendChild(h3);

    let time = document.createElement("div");
    time.classList.add("time");
    let spanPostedAt = document.createElement("span");
    spanPostedAt.classList.add("posted-at");
    spanPostedAt.appendChild(document.createTextNode(array[i].postedAt));
    time.appendChild(spanPostedAt);
    let spanContract = document.createElement("span");
    spanContract.classList.add("contract");
    spanContract.appendChild(document.createTextNode(array[i].contract));
    time.appendChild(spanContract);
    let spanLocation = document.createElement("span");
    spanLocation.classList.add("location");
    spanLocation.appendChild(document.createTextNode(array[i].location));
    time.appendChild(spanLocation);

    details.appendChild(time);
    description.appendChild(details);
    list.appendChild(description);

    let stats = document.createElement("div");
    stats.classList.add("stats");

    let spanRole = document.createElement("span");
    spanRole.setAttribute(`data-role-${array[i].role}`, array[i].role);
    list.setAttribute(`data-role-${array[i].role}`, array[i].role);
    spanRole.appendChild(document.createTextNode(array[i].role));
    stats.appendChild(spanRole);
    let spanLevel = document.createElement("span");
    spanLevel.setAttribute(`data-level-${array[i].level}`, array[i].level);
    list.setAttribute(`data-level-${array[i].level}`, array[i].level);
    spanLevel.appendChild(document.createTextNode(array[i].level));
    stats.appendChild(spanLevel);
    for (let j = 0; j < array[i].languages.length; j++) {
      let spanLanguage = document.createElement("span");
      spanLanguage.setAttribute(
        `data-languages-${array[i].languages[j]}`,
        array[i].languages[j]
      );
      list.setAttribute(
        `data-languages-${array[i].languages[j]}`,
        array[i].languages[j]
      );
      spanLanguage.appendChild(document.createTextNode(array[i].languages[j]));
      stats.appendChild(spanLanguage);
    }
    for (let k = 0; k < array[i].tools.length; k++) {
      let spanTools = document.createElement("span");
      spanTools.setAttribute(
        `data-tools-${array[i].tools[k]}`,
        array[i].tools[k]
      );
      list.setAttribute(`data-tools-${array[i].tools[k]}`, array[i].tools[k]);
      spanTools.appendChild(document.createTextNode(array[i].tools[k]));
      stats.appendChild(spanTools);
    }
    list.appendChild(stats);
    listsContainer.appendChild(list);
  }
  filtersClick();
}
// End Creating Data
// On Load
window.onload = () => {
  getData(false);
  localStorage.clear();
};
//On Clicking on any tag
function filtersClick() {
  let tags = document.querySelectorAll(".list .stats span");
  tags.forEach((t) => {
    let i = 1;
    t.onclick = () => {
      console.log(t);

      if (!filterListContainer.hasAttribute(t.attributes[0].name)) {
        let attrName = t.attributes[0].name;
        let attrValue = t.attributes[0].value;
        filterListContainer.setAttribute(attrName, attrValue);

        let span = document.createElement("span");
        let cancel = document.createElement("button");

        span.appendChild(document.createTextNode(attrValue));
        span.appendChild(cancel);
        span.setAttribute(attrName, attrValue);

        filterListContainer.appendChild(span);
        checkFilters();
        cancel.onclick = () => {
          span.classList.add("can");

          setTimeout(() => {
            span.remove();
            filterListContainer.removeAttribute(span.attributes[0].name);
            checkFilters();
            getData(true);
            i--;
          }, 300);
        };
        getData(true);
        i++;
      }
    };
  });
}
// Start Checking Filters List
function checkFilters() {
  if (filterListContainer.innerHTML == "") {
    filterList.classList.remove("show-list");
  } else {
    filterList.classList.add("show-list");
  }
}
// End Checking Filters List
// Clear Button
clearButtonFilters.onclick = () => {
  for (let i = 1; i < filterListContainer.attributes.length; ) {
    filterListContainer.removeAttribute(filterListContainer.attributes[i].name);
  }

  let spans = document.querySelectorAll(".filters span");
  spans.forEach((s) => s.classList.add("vanish"));

  setTimeout(() => {
    filterListContainer.innerHTML = "";
    checkFilters();
    getData();
  }, 1000);
};
