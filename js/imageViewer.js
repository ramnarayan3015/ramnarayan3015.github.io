// $(".images img").click(function(){
//     $("#full-image").attr("src", $(this).attr("src"));
//     $('#image-viewer').show();
// });

// $("#image-viewer .close").click(function(){
//     $('#image-viewer').hide();
// });

Array.from(document.querySelectorAll(".images img")).forEach(e => e.addEventListener("click", function(e){
    document.getElementById("full-image").setAttribute("src", document.getElementById("techStack").getAttribute("src"));
    // document.getElementById('image-viewer').show();
    document.getElementById("image-viewer").style.display = "block";
}))

Array.from(document.querySelectorAll("#image-viewer .close")).forEach(e => e.addEventListener("click", function(){
    // document.getElementById('image-viewer').hide();
    document.getElementById("image-viewer").style.display = "none";
}))