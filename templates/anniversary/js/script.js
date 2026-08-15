/* ============================================================
   SITE DATA
============================================================ */

let siteData = {};


/* ============================================================
   LOAD WEBSITE DATA FROM SUPABASE
============================================================ */

async function loadWebsiteData() {

    try {

        let slug;

        // URL: /anniversary/kanu
        if (window.location.pathname.startsWith("/anniversary/")) {

            slug = window.location.pathname.split("/").pop();

        } else {

            // Backup support
            const params = new URLSearchParams(
                window.location.search
            );

            slug = params.get("slug");

        }


        if (!slug) {

            alert("Website not found.");
            return;

        }


        const { data, error } = await client
            .from("anniversary_websites")
            .select("*")
            .eq("slug", slug)
            .single();


        if (error) throw error;


        console.log("Anniversary Database Row:", data);


        /* ====================================================
           SAVE DATABASE DATA
        ==================================================== */

        siteData = {

            giftBg: data.gift_bg,

            letterBg: data.letter_bg,

            bouquetBg: data.bouquet_bg,

            songTitle: data.song_title,

            artistName: data.artist_name,

            albumCoverUrl: data.album_cover,

            songUrl: data.song_url

        };


        applySiteData();

    }

    catch (err) {

        console.error("Error loading anniversary website:", err);

        alert("Unable to load website.");

    }

}


/* ============================================================
   APPLY DATA TO WEBSITE
============================================================ */

function applySiteData() {

    console.log("Gift Background:", siteData.giftBg);
    console.log("Letter Background:", siteData.letterBg);
    console.log("Bouquet Background:", siteData.bouquetBg);
    console.log("Album Cover:", siteData.albumCoverUrl);
    console.log("Song:", siteData.songUrl);


    /* Song Title */

    if (siteData.songTitle) {

        document.getElementById("songTitle").innerText =
            siteData.songTitle;

    }


    /* Artist Name */

    if (siteData.artistName) {

        document.getElementById("artistName").innerText =
            siteData.artistName;

    }


    /* Album Cover */

    if (siteData.albumCoverUrl) {

        document.getElementById("albumCover").src =
            siteData.albumCoverUrl;

    }


    /* Song */

    if (siteData.songUrl) {

        const audio =
            document.getElementById("birthdaySong");

        const source =
            audio.querySelector("source");

        source.src = siteData.songUrl;

        audio.load();

    }

}


/* ============================================================
   CONFETTI
============================================================ */

function launchConfetti() {

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


/* ============================================================
   CONTINUE BUTTON
============================================================ */

function changePage() {

    launchConfetti();


    document.getElementById("page").style.backgroundImage =
        'url("assets/background.png")';


    document.getElementById("candleBtn").style.display =
        "none";


    document.getElementById("acceptGiftPage").style.display =
        "block";

}


/* ============================================================
   GIFT 1
   Dynamic Gift Background + Spotify Card
============================================================ */

function expandGift1() {

    document.getElementById("giftHeading").style.display =
        "none";


    document.getElementById("backBtn").style.display =
        "block";


    const page = document.getElementById("page");


    /* Dynamic Gift Background */

    if (siteData.giftBg) {

        page.style.backgroundImage =
            `url("${siteData.giftBg}")`;

    }


    document.getElementById("giftsContainer").style.display =
        "none";


    document.getElementById("letterText").style.opacity =
        "1";


    document.getElementById("spotifyCard").style.display =
        "flex";

}


/* ============================================================
   GIFT 2
   FLOWER / BOUQUET
============================================================ */

function expandGift2() {

    document.getElementById("giftHeading").style.display =
        "none";


    document.getElementById("giftsContainer").style.display =
        "none";


    document.getElementById("bouquetResult").style.display =
        "none";


    document.getElementById("flowerPage").style.display =
        "block";


    document.getElementById("backBtn").style.display =
        "block";

}


/* ============================================================
   GIFT 3
   Dynamic Letter Background
============================================================ */

function expandGift3() {

    document.getElementById("giftHeading").style.display =
        "none";


    document.getElementById("giftsContainer").style.display =
        "none";


    document.getElementById("backBtn").style.display =
        "block";


    const page = document.getElementById("page");


    /* Dynamic Letter Background */

    if (siteData.letterBg) {

        page.style.backgroundImage =
            `url("${siteData.letterBg}")`;

    }

}


/* ============================================================
   MUSIC
============================================================ */

function toggleMusic() {

    const song =
        document.getElementById("birthdaySong");

    const playBtn =
        document.getElementById("playBtn");


    if (song.paused) {

        song.play()

            .then(() => {

                playBtn.innerHTML = "⏸";

            })

            .catch(error => {

                console.log("Music error:", error);

                alert(
                    "Unable to play the song."
                );

            });

    }

    else {

        song.pause();

        playBtn.innerHTML = "▶";

    }

}


/* Reset play button when song ends */

document.addEventListener("DOMContentLoaded", () => {

    const song =
        document.getElementById("birthdaySong");

    song.addEventListener("ended", function () {

        document.getElementById("playBtn").innerHTML =
            "▶";

    });

});


/* ============================================================
   BACK BUTTON
============================================================ */

function goBack() {

    /* Hide Spotify Card */

    document.getElementById("spotifyCard").style.display =
        "none";


    /* Reset Background */

    document.getElementById("page").style.backgroundImage =
        'url("assets/background.png")';


    /* Hide side image */

    document.getElementById("sideImage").style.display =
        "none";


    /* Hide letter */

    document.getElementById("letterText").style.opacity =
        "0";


    document.getElementById("typedMessage").innerHTML =
        "";


    /* Hide bouquet */

    document.getElementById("bouquetResult").style.display =
        "none";


    document.getElementById("bouquetResult").src =
        "";


    /* Hide flower page */

    document.getElementById("flowerPage").style.display =
        "none";


    /* Clear flower selections */

    selectedFlowers.length = 0;


    document.querySelectorAll(".flower").forEach(flower => {

        flower.classList.remove("selected");

    });


    /* Stop music */

    const song =
        document.getElementById("birthdaySong");


    song.pause();


    song.currentTime = 0;


    document.getElementById("playBtn").innerHTML =
        "▶";


    /* Show Gift Selection */

    document.getElementById("giftHeading").style.display =
        "block";


    document.getElementById("giftsContainer").style.display =
        "flex";


    /* Hide Back Button */

    document.getElementById("backBtn").style.display =
        "none";

}


/* ============================================================
   ACCEPT / REJECT GIFT
============================================================ */

function acceptGift() {

    document.getElementById("acceptGiftPage").style.transform =
        "translate(-50%,-50%) scale(0.9)";


    setTimeout(() => {

        document.getElementById("acceptGiftPage").style.display =
            "none";


        document.getElementById("giftsContainer").style.display =
            "flex";


        document.getElementById("giftHeading").style.display =
            "block";

    }, 150);

}


function rejectGift() {

    document.getElementById("acceptHeading").innerText =
        "WHY DID YOU CLICK NO!";


    document.getElementById("acceptSticker").src =
        "assets/sad.png";


    document.getElementById("acceptButtons").innerHTML =
        `<button id="tryAgainBtn"
        onclick="resetAcceptGift()">
        TRY AGAIN
        </button>`;

}


function resetAcceptGift() {

    document.getElementById("acceptHeading").innerText =
        "PLEASE ACCEPT THE GIFT";


    document.getElementById("acceptSticker").src =
        "assets/sticker1.png";


    document.getElementById("acceptButtons").innerHTML =
        `<button onclick="acceptGift()">YES</button>
         <button onclick="rejectGift()">NO</button>`;

}


/* ============================================================
   FLOWER SELECTION
============================================================ */

const selectedFlowers = [];


document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".flower").forEach(flower => {

        flower.onclick = function () {

            const name =
                this.dataset.name;


            if (this.classList.contains("selected")) {

                this.classList.remove("selected");


                const index =
                    selectedFlowers.indexOf(name);


                if (index > -1) {

                    selectedFlowers.splice(index, 1);

                }

            }

            else {

                this.classList.add("selected");


                selectedFlowers.push(name);

            }

        };

    });


    /* ========================================================
       NEXT FLOWER BUTTON
    ======================================================== */

    document.getElementById("nextFlowerBtn").onclick =
        function () {

            if (selectedFlowers.length === 0) {

                alert(
                    "Please select at least one flower."
                );

                return;

            }


            const key =
                [...selectedFlowers]
                    .sort()
                    .join("_");


            /* These bouquet result images remain static */

            const bouquets = {

                "rose":
                    "assets/rosebouquet.png",

                "lilly":
                    "assets/lillybouquet.png",

                "sunflower":
                    "assets/sunflowerbouquet.png",


                "lilly_rose":
                    "assets/rose_lilly.png",

                "rose_sunflower":
                    "assets/rose_sunflower.png",

                "lilly_sunflower":
                    "assets/lilly_sunflower.png",


                "lilly_rose_sunflower":
                    "assets/rose_lilly_sunflower.png"

            };


            /* Hide flower page */

            document.getElementById("flowerPage").style.display =
                "none";


            /* Dynamic Bouquet Background */

            if (siteData.bouquetBg) {

                document.getElementById("page").style.backgroundImage =
                    `url("${siteData.bouquetBg}")`;

            }


            /* Show selected bouquet */

            const img =
                document.getElementById("bouquetResult");


            img.src = bouquets[key];


            img.style.display =
                "block";

        };

});


/* ============================================================
   LOAD WEBSITE WHEN PAGE OPENS
============================================================ */

window.addEventListener("DOMContentLoaded", () => {

    loadWebsiteData();

});