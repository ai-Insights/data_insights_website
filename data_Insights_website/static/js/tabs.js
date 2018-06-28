function openNow(evt, idOfType, affect, effect_on) {
    // Declare all variables
    var i, tabcontent, tablinks, breadCrumContent;
    // Get all elements with class=affect and hide them
    tabcontent = document.getElementsByClassName(affect);
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    console.log("lets try here");
    // Get all elements with class="tablinks" and remove the classes "active" and the indicator display is turned to "none"
    tablinks = document.getElementsByClassName(effect_on);
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
        indicator = tablinks[i].children;
        var j;
        for(j=0; j<indicator.length; j++){
            if(indicator[j].classList.contains('fa-circle')){
                indicator[j].style.display = "none";
            }
        }
    }
    // Show the current tab, and add an "active" class to the button that opened the tab
    elementToDisplay = document.getElementById(idOfType);
    if(idOfType == "after-click"){
        console.log('Yeso');
        var docFrag = document.createDocumentFragment();
        tabcontain = document.querySelector('.' + affect);
        parentId = document.getElementById(idOfType);
        checkingAndCorrect = parentId.querySelector(".card-faqs-list").children;
        var subDivs = tabcontain.querySelectorAll('.card-faqs');//here we are getting the children of thetabcontain. but instead of using the .children or .childnode which are very dynamic and cause issues we decided to use querySelector()

        for(var i = 0; i<checkingAndCorrect.length; i++){
            if(checkingAndCorrect[i].classList.contains('visit')){ 
                checkingAndCorrect[i].classList.remove("visit");
                checkingAndCorrect[i].children[0].classList.remove("fa-minus-circle");
                checkingAndCorrect[i].children[0].classList.add("fa-plus-circle");
                //checkingAndCorrect[i].querySelector('a').setAttribute("onclick", "openNow(event, faqs-answer-"+i+", faqs-main, card-faqs-sub)");
            }
        }
        evt.currentTarget.parentNode.className += " visit";
        evt.currentTarget.parentNode.children[0].classList.remove("fa-plus-circle");
        evt.currentTarget.parentNode.children[0].classList.add("fa-minus-circle");
        for(var i = 0; i<subDivs.length; i++){
            docFrag.appendChild(subDivs[i]);
        }
        colToUpdate = elementToDisplay.getElementsByClassName('card-faqs-list');
        colToUpdate[0].appendChild(docFrag);

        elementId = evt.currentTarget.parentNode.id;
        toHide = document.querySelectorAll(".faqs-body");
        for(var i; i< toHide.length; i++){
            console.log(toHide[i]);
            toHide[i].style.display = "none";
        }
        elementToDisplay.querySelector("#"+"content-"+elementId).style.display = "block";
    }
    elementToDisplay.style.display = "block";
    evt.currentTarget.className += " active";
    if (evt.currentTarget.classList.contains('nav-link') || elementToDisplay.classList.contains('sub-body')) {
        if(elementToDisplay.classList.contains('sub-body')){
            var indicator = evt.currentTarget.parentNode.children;
            //used children instead of childNodes above because childNodes return Nodes including text nodes but childreb
            //strictly returns only elements.
            for(i=0; i<indicator.length; i++){
                if(indicator[i].classList.contains('fa-circle')){
                    indicator[i].style.display = "block";
                }
            }
        }
    } else {
        breadCrumContent = evt.currentTarget.innerHTML;
        if(idOfType != "after-click"){
            addBreadCrum(breadCrumContent, 'bread');
        }
    }
}

function breadCrumOpen(activeButton) {
    var i, tabLink;
    // This function lets the 'all' breadcrum to take you back to the page pointed to by the active button
    tabLink = document.getElementsByClassName(activeButton);
    for (i = 0; i < tabLink.length; i++) {
        if (tabLink[i].classList.contains('active')) {
            tabLink[i].click();
        }
    }
}

function addBreadCrum(htmlText, targetClass) {
    var list, newList, newListChild, i, check = false;
    list = document.getElementById('breadCrum');
    listAnchors = document.getElementsByClassName('bread');
    for (i = 0; i < listAnchors.length; i++) {
        if (listAnchors[i].classList.contains('active')) {
            listAnchors[i].className = listAnchors[i].className.replace(' active', '');
        }
    }
    //creating the list element
    newList = document.createElement('li');
    newList.setAttribute('class', 'list-inline-item');
    //creating the link
    newListChild = document.createElement('a');
    newListChild.innerHTML ='>  ' + htmlText.toUpperCase();
    newListChild.setAttribute('href', '');
    newListChild.setAttribute('class', 'bread active');
    if (newListChild.innerHTML != "All") {
        newListChild.onclick = breadCrumOpen(targetClass);
        newList.appendChild(newListChild);
    }else{
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
    }
    list.appendChild(newList);
    console.log('success');
}