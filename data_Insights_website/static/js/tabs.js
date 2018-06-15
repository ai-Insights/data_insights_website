function openNow(evt, idOfType, affect, effect_on) {
    // Declare all variables
    var i, tabcontent, tablinks;
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName(affect);
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName(effect_on);
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(idOfType).style.display = "block";
    evt.currentTarget.className += " active";
    //addIcon(idOfType);
}

function breadCrumOpen(evt, activeButton){
    var i, tabLink;
    // This function lets the 'all' breadcrum to take you back to the page poionted to by the active button 4
    tabLink = document.getElementsByClassName(activeButton);
    for (i = 0; i < tabLink.length; i++){
        if(tabLink[i].classList.contains('active') ){
            tabLink[i].click();
        }
    }
}
/*function addIcon(listItem){
    //function to add the i tag to all list-items with menues only
    var i, anchorLink;
    tablink = document.getElementById(listItem).childNodes;
    for(i = 0; i< tablink.length; i++){
        console.log(tablink.secondChild);
        if(tablink[i].firstChild.classList.contains('has-menu')){
            newIcon = document.createElement('i');
            newIcon.setAttribute('class', 'fas fa-ellipsis-h');
            tablink[i].insertBefore(newIcon, tablink[i].firstChild.nextSibling);
        }
    }
}*/