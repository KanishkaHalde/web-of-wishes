
/* ============================================================
   SITE DATA
   This is the one block you'll eventually replace with data
   pulled from the database (Supabase) using the ID in the URL.
   For now it's filled with your current hardcoded content so
   the site behaves exactly as before, just data-driven.
   ============================================================ */
let siteData = {};

async function loadWebsiteData() {

    try {

        let slug;

// If URL is /birthday/kanu
if(window.location.pathname.startsWith("/birthday/")){

    slug = window.location.pathname.split("/").pop();

}
// Otherwise support old links
else{

    const params = new URLSearchParams(window.location.search);

    slug = params.get("slug");

}

if(!slug){

    alert("Website not found.");

    return;

}

        const { data, error } = await client
            .from("birthday_websites")
            .select("*")
            .eq("slug", slug)
            .single();

        if (error) throw error;

        console.log("Database Row:", data);

console.log("Album:", data.album_cover);

console.log("Song:", data.song_url);

console.log("Letter:", data.letter_bg);

        siteData = {

    songTitle: data.song_title,

    artistName: data.artist_name,

    albumCoverUrl: data.album_cover,

    songUrl: data.song_url,

    letterBg: data.letter_bg,

    openCard: data.open_card,

    musicCard: data.music_card

};

        applySiteData();

    }

    catch (err) {

        console.error(err);

    }

}

function applySiteData() {

    console.log("Album URL:", siteData.albumCoverUrl);
    console.log("Song URL:", siteData.songUrl);
    console.log("Letter URL:", siteData.letterBg);
    console.log("Open Card:", siteData.openCard);
    console.log("Music Card:", siteData.musicCard);

    // Song Title
    document.getElementById("songTitle").innerText =
        siteData.songTitle;

    // Artist Name
    document.getElementById("artistName").innerText =
        siteData.artistName;

    // Album Cover
    if (siteData.albumCoverUrl) {
        document.getElementById("albumCover").src =
            siteData.albumCoverUrl;
    }

    // Music Card
    if (siteData.musicCard) {
        document.getElementById("musicCard").src =
            siteData.musicCard;
    }

    // Song
    if (siteData.songUrl) {

        const audio = document.getElementById("birthdaySong");
        const source = audio.querySelector("source");

        source.src = siteData.songUrl;

        audio.load();
    }

}
function launchConfetti(){

    var duration = 3000;
    var end = Date.now() + duration;

    (function frame() {

        confetti({
            particleCount: 5,
            angle: 60,
            spread: 70,
            origin: { x: 0 }
        });

        confetti({
            particleCount: 5,
            angle: 120,
            spread: 70,
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }

    }());
}

let stage = 0;

function changePage(){

    const page = document.getElementById("page");
    const btnText = document.getElementById("btnText");
    const button = document.getElementById("candleBtn");
    const gifts = document.getElementById("giftsContainer");

    if(stage === 0){

    launchConfetti();

   page.style.backgroundImage = 'url("assets/next_page.png")';
    btnText.innerText = "Next";
    stage = 1;

}

    else if(stage === 1){

    page.style.backgroundImage = 'url("assets/background.png")';
    button.style.display = "none";

    document.getElementById("acceptGiftPage").style.display = "block";

    stage = 2;
}
}

/* ---------- Gift 1: Letter + Polaroid Photos ---------- */

// Fills up to 4 polaroid slots scattered around the letter.
// If you have more than 4 photos, only the first 4 show here for now -
// we can add a "view more" option later if needed.
function renderPolaroids(){

    if(!siteData.photos) return;

    for(let i = 0; i < 4; i++){

        const slot = document.getElementById("polaroid-" + i);

        if(siteData.photos[i]){

            slot.src = siteData.photos[i];
            slot.classList.add("visible");

        }else{

            slot.classList.remove("visible");

        }

    }

}

function hidePolaroids(){
    for(let i = 0; i < 4; i++){
        document.getElementById("polaroid-" + i).classList.remove("visible");
    }
}

function expandGift1() {

    document.getElementById("giftHeading").style.display = "none";
    document.getElementById("backBtn").style.display = "block";

    const page = document.getElementById("page");

    // Show uploaded letter background
    page.style.backgroundImage = `url("${siteData.letterBg}")`;

    // Hide gifts
    document.getElementById("giftsContainer").style.display = "none";

}

function expandGift2(){
    document.getElementById("giftHeading").style.display = "none";
    const gift2 = document.getElementById("gift2");
    const backBtn = document.getElementById("backBtn");
    const sideImage = document.getElementById("sideImage");

    backBtn.style.display = "block";

    document.querySelectorAll(".gift").forEach(gift => {

        if(gift !== gift2){
            gift.style.display = "none";
        }

    });

    gift2.style.position = "fixed";
    gift2.style.zIndex = "9999";

    /* Gift on left */
    gift2.style.left = "-10vw";
    gift2.style.top = "50%";
    gift2.style.transform = "translateY(-50%)";
    gift2.style.width = "75vw";
    gift2.style.height = "100vh";
    gift2.style.objectFit = "contain";

    /* Show image on right */
    sideImage.style.display = "block";
}
function expandGift3(){
    document.getElementById("giftHeading").style.display = "none";
    const gift3 = document.getElementById("gift3");
    const backBtn = document.getElementById("backBtn");
    const page = document.getElementById("page");
    const cardContainer = document.getElementById("cardContainer");

    backBtn.style.display = "block";

    document.querySelectorAll(".gift").forEach(gift => {

        if(gift !== gift3){
            gift.style.display = "none";
        }

    });

    /* Change background */
   page.style.backgroundImage = 'url("assets/newbg.png")';

    /* Hide gift box */
    gift3.style.display = "none";

    /* Show card */
    cardContainer.style.display = "block";
    document.getElementById("musicSection").style.display = "block";
}

function openCard(){

    const cardImage = document.getElementById("cardImage");

    cardImage.src = siteData.openCard;

}
function toggleMusic(){

    const song = document.getElementById("birthdaySong");
    const btn = document.getElementById("playBtn");

    if(song.paused){

        song.play();
        btn.innerHTML = "❚❚";

    }else{

        song.pause();
        btn.innerHTML = "▶";

    }
}
function goBack(){

    /* Restore gift page background */
    document.getElementById("page").style.backgroundImage =
'url("assets/background.png")';

    /* Hide card section */
    document.getElementById("cardContainer").style.display = "none";

    /* Reset card */
    document.getElementById("cardImage").src = "assets/close_card.png";
    document.getElementById("cardImage").onclick = openCard;

    /* Hide music section */
    document.getElementById("musicSection").style.display = "none";

    /* Stop music */
    const song = document.getElementById("birthdaySong");

    if(song){
        song.pause();
        song.currentTime = 0;
    }

    /* Reset play button */
    const playBtn = document.getElementById("playBtn");

    if(playBtn){
        playBtn.innerHTML = "▶";
    }

    const gifts = document.getElementById("giftsContainer");
    const backBtn = document.getElementById("backBtn");

    /* Hide side image from Gift 2 */
    document.getElementById("sideImage").style.display = "none";

    /* Hide letter from Gift 1 */

    /* Restore all gifts */
    document.querySelectorAll(".gift").forEach(gift => {

        gift.removeAttribute("style");
        gift.className = "gift";
        gift.style.display = "";

    });
    document.getElementById("giftHeading").style.display = "block";
    gifts.style.display = "flex";

    backBtn.style.display = "none";
}
function acceptGift(){

    document.getElementById("acceptGiftPage").style.transform =
    "translate(-50%,-50%) scale(0.9)";

    setTimeout(() => {
        document.getElementById("acceptGiftPage").style.display = "none";
        document.getElementById("giftsContainer").style.display = "flex";
        document.getElementById("giftHeading").style.display = "block";
    }, 150);
}

function rejectGift(){

    document.getElementById("acceptHeading").innerText =
    "WHY DID YOU CLICK NO!";

    document.getElementById("acceptSticker").src = "assets/sad.png";

    document.getElementById("acceptButtons").innerHTML =
    `<button id="tryAgainBtn" onclick="resetAcceptGift()">TRY AGAIN</button>`;
}

function resetAcceptGift(){

    document.getElementById("acceptHeading").innerText =
    "PLEASE ACCEPT THE GIFT";

    document.getElementById("acceptSticker").src = "assets/sticker1.png";

    document.getElementById("acceptButtons").innerHTML =
    `<button onclick="acceptGift()">YES</button>
     <button onclick="rejectGift()">NO</button>`;
}
window.addEventListener("DOMContentLoaded", () => {

    loadWebsiteData();

});