var elt='learn';
function openNow(evt, idOfType, affect, effect_on) {
    // Declare all variables
    var i, tabcontent, tablinks, breadCrumContent;  
    if(effect_on == 'nav-link'){elt = idOfType;}
    // Get all elements with class=affect and hide them
    if(effect_on == 'nav-link' || elt=='learn'){
        var content = document.getElementById(elt);
        tabcontent = document.getElementsByClassName(affect);
        tablinks = document.getElementsByClassName(effect_on);
    }else{
        var content = document.getElementById(elt);
        tabcontent = content.getElementsByClassName(affect);
        tablinks = content.getElementsByClassName(effect_on);
    }
    
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    // Get all elements with class="tablinks" and remove the classes "active" and the indicator display is turned to "none"
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
            toHide[i].style.display = "none";
        }
        elementToDisplay.querySelector("#"+"content-"+elementId).style.display = "block";
    }
    if(elementToDisplay == null){
        content.querySelector('.error').style.display = 'block';
    }else{
        elementToDisplay.style.display = "block";
    }
    evt.currentTarget.className += " active";
    if (evt.currentTarget.classList.contains('nav-link') || elementToDisplay.classList.contains('sub-body')) {
        if(elementToDisplay.classList.contains('sub-body')){
            var indicator = evt.currentTarget.parentNode.children;
            //used children instead of childNodes above because childNodes return Nodes including text nodes but childreb
            //strictly returns only elements.
            for(i=0; i<indicator.length; i++){
                if(indicator[i].classList.contains('fa-circle')){
                    indicator[i].style.display = "block";
                    indicator[i].parentNode.firstChild.className += " activated";
                }
            }
        }
    } else {
        breadCrumContent = evt.currentTarget.innerHTML;
        if(idOfType != "after-click"){
            ulForBreadCrum = content.querySelectorAll('ul');
            for(var i=0; i<ulForBreadCrum.length; i++){
                if(ulForBreadCrum[i].contains(evt.currentTarget)){
                    classname = ulForBreadCrum[i].classList[1];
                }
            }
            addBreadCrum(breadCrumContent, 'bread', elt+'-bread', classname);
        }
    }
}

function breadCrumOpen(evt, toDisplay) {
    var i, todisplay, tohide, childses, ulOfChildses;
    // This function lets the 'all' breadcrum to take you back to the page pointed to by the active button
    todisplay = document.querySelector('.'+toDisplay);
    tohide = todisplay.parentNode.children;
    for(var i = 0; i<tohide.length; i++){
        tohide[i].style.display = 'none';
    }
    todisplay.style.display = 'block';
    childses=evt.currentTarget.parentNode;
    ulOfChildses = childses.parentNode;
    if(evt.currentTarget.innerHTML.toUpperCase() != 'All'.toUpperCase()){
        while(childses.nextSibling){
            //remove anyother breadcrum after the currently clicked
            ulOfChildses.removeChild(childses.nextSibling);
        }
        ulOfChildses.removeChild(childses);
    }else{
        while(childses.nextSibling){
            //remove anyother breadcrum after the currently clicked
            ulOfChildses.removeChild(childses.nextSibling);
        }
    }
    return false;
}

function addBreadCrum(htmlText, targetClass, eltm, pointsTo) {
    var list, newList, newListChild, i, check = false;
    list = document.getElementById(eltm);
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
    newListChild.setAttribute('href', '#');
    newListChild.setAttribute('class', 'bread active');
    if (newListChild.innerHTML != "All") {
        newListChild.setAttribute('onclick', "breadCrumOpen(event, '"+pointsTo+"')");
        newList.appendChild(newListChild);
    }else{
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
    }
    list.appendChild(newList);
}