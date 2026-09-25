/* ============================================================
   BOYFRIEND'S DAY WEBSITE
   Dynamic data comes from Supabase
============================================================ */


/* ============================================================
   GET SLUG
   Production example:
   /boyfriends-day/for-piyuuu
============================================================ */

const pathParts =
    window.location.pathname
        .split("/")
        .filter(Boolean);

const slug =
    pathParts[pathParts.length - 1];

let websiteData = null;


/* ============================================================
   LOAD WEBSITE DATA
============================================================ */

async function loadWebsite() {

    try {

        if (!slug || slug === "index.html") {
            showUnavailable();
            return;
        }


        const { data, error } =
            await client
                .from("boyfriends_day_websites")
                .select("*")
                .eq("slug", slug)
                .maybeSingle();


        if (error) {

            console.error(
                "Supabase Error:",
                error
            );

            showUnavailable();
            return;
        }


        if (!data) {

            console.error(
                "Website not found:",
                slug
            );

            showUnavailable();
            return;
        }


        websiteData = data;


        console.log(
            "Boyfriend's Day Website:",
            data
        );


        /* ====================================================
           DYNAMIC SONG
        ==================================================== */

        document.getElementById("songTitle").innerText =
            data.song_title || "";


        document.getElementById("artistName").innerText =
            data.artist_name || "";


        document.getElementById("albumCover").src =
            data.album_cover || "";


        const song =
            document.getElementById("birthdaySong");


        const source =
            song.querySelector("source");


        source.src =
            data.song_url || "";


        song.load();


        /* ====================================================
           DYNAMIC OPEN CARD
        ==================================================== */

        if (data.open_card) {

            document.getElementById("cardImage").dataset.openCard =
                data.open_card;

        }


        /* ====================================================
           DYNAMIC MUSIC CARD
        ==================================================== */

        if (data.music_card) {

            document.getElementById("musicCard").src =
                data.music_card;

        }

    }

    catch (error) {

        console.error(
            "Website loading error:",
            error
        );

        showUnavailable();

    }

}


/* ============================================================
   SHOW UNAVAILABLE
============================================================ */

function showUnavailable() {

    document.body.innerHTML = `

        <div style="
            width:100vw;
            height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            text-align:center;
            background:#fbf7f8;
            font-family:Arial,sans-serif;
            padding:30px;
        ">

            <div>

                <h1 style="
                    color:#1f3b73;
                    margin-bottom:15px;
                ">
                    This website is unavailable 💔
                </h1>

                <p style="
                    color:#555;
                    font-size:18px;
                ">
                    This surprise website may have been
                    removed or is no longer available.
                </p>

            </div>

        </div>

    `;

}


/* ============================================================
   CONFETTI
============================================================ */

function launchConfetti() {

    if (typeof confetti === "undefined")
        return;


    const duration = 3000;

    const end =
        Date.now() + duration;


    (function frame() {

        confetti({

            particleCount: 5,

            angle: 60,

            spread: 70,

            origin: {
                x: 0
            }

        });


        confetti({

            particleCount: 5,

            angle: 120,

            spread: 70,

            origin: {
                x: 1
            }

        });


        if (Date.now() < end) {

            requestAnimationFrame(frame);

        }

    })();

}


/* ============================================================
   CONTINUE
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
   GIFT 1 — LETTER
============================================================ */

function expandGift1() {

    document.getElementById("giftHeading").style.display =
        "none";


    document.getElementById("backBtn").style.display =
        "block";


    document.getElementById("giftsContainer").style.display =
        "none";


    /* Load letter background ONLY when Gift 1 is opened */

    if (
        websiteData &&
        websiteData.letter_bg
    ) {

        document.getElementById("page").style.backgroundImage =
            `url("${websiteData.letter_bg}")`;

    }


    document.getElementById("letterText").style.opacity =
        "1";

}


/* ============================================================
   GIFT 2
============================================================ */

function expandGift2() {

    document.getElementById("giftHeading").style.display =
        "none";


    document.getElementById("backBtn").style.display =
        "block";


    document.getElementById("letterText").style.opacity =
        "0";


    document.getElementById("typedMessage").innerHTML =
        "";


    const gift2 =
        document.getElementById("gift2");


    const sideImage =
        document.getElementById("sideImage");


    document.querySelectorAll(".gift")
        .forEach(gift => {

            if (gift !== gift2) {

                gift.style.display =
                    "none";

            }

        });


    gift2.style.position =
        "fixed";


    gift2.style.zIndex =
        "9999";


    gift2.style.left =
        "-10vw";


    gift2.style.top =
        "50%";


    gift2.style.transform =
        "translateY(-50%)";


    gift2.style.width =
        "75vw";


    gift2.style.height =
        "100vh";


    gift2.style.objectFit =
        "contain";


    sideImage.style.display =
        "block";

}


/* ============================================================
   GIFT 3 — MUSIC
============================================================ */

function expandGift3() {

    document.getElementById("giftHeading").style.display =
        "none";


    document.getElementById("backBtn").style.display =
        "block";


    const gift3 =
        document.getElementById("gift3");


    document.querySelectorAll(".gift")
        .forEach(gift => {

            if (gift !== gift3) {

                gift.style.display =
                    "none";

            }

        });


    document.getElementById("page").style.backgroundImage =
        'url("assets/newbg.png")';


    gift3.style.display =
        "none";


    document.getElementById("cardContainer").style.display =
        "block";


    document.getElementById("musicSection").style.display =
        "block";

}


/* ============================================================
   OPEN CARD
============================================================ */

function openCard() {

    const cardImage =
        document.getElementById("cardImage");


    if (cardImage.dataset.openCard) {

        cardImage.src =
            cardImage.dataset.openCard;

    }

    else {

        cardImage.src =
            "assets/close_card.png";

    }


    cardImage.onclick = null;

}


/* ============================================================
   PLAY / PAUSE MUSIC
============================================================ */

function toggleMusic() {

    const song =
        document.getElementById("birthdaySong");


    const playBtn =
        document.getElementById("playBtn");


    if (song.paused) {

        song.play()
            .then(() => {

                playBtn.innerHTML =
                    "❚❚";

            })
            .catch(error => {

                console.error(
                    "Music Error:",
                    error
                );

                alert(
                    "Unable to play the song."
                );

            });

    }

    else {

        song.pause();

        playBtn.innerHTML =
            "▶";

    }

}


/* ============================================================
   MUSIC ENDED
============================================================ */

document
    .getElementById("birthdaySong")
    .addEventListener("ended", function() {

        document.getElementById("playBtn").innerHTML =
            "▶";

    });


/* ============================================================
   BACK BUTTON
============================================================ */

function goBack() {

    const page =
        document.getElementById("page");


    page.style.backgroundImage =
        'url("assets/background.png")';


    document.getElementById("cardContainer").style.display =
        "none";


    document.getElementById("cardImage").src =
        "assets/close_card.png";


    document.getElementById("cardImage").onclick =
        openCard;


    document.getElementById("musicSection").style.display =
        "none";


    const song =
        document.getElementById("birthdaySong");


    if (song) {

        song.pause();

        song.currentTime = 0;

    }


    document.getElementById("playBtn").innerHTML =
        "▶";


    document.getElementById("sideImage").style.display =
        "none";


    document.getElementById("letterText").style.opacity =
        "0";


    document.getElementById("typedMessage").innerHTML =
        "";


    document.querySelectorAll(".gift")
        .forEach(gift => {

            gift.removeAttribute("style");

            gift.className =
                "gift";

            gift.style.display =
                "";

        });


    document.getElementById("giftHeading").style.display =
        "block";


    document.getElementById("giftsContainer").style.display =
        "flex";


    document.getElementById("backBtn").style.display =
        "none";

}


/* ============================================================
   ACCEPT GIFT
============================================================ */

function acceptGift() {

    const acceptPage =
        document.getElementById("acceptGiftPage");


    acceptPage.style.transform =
        "translate(-50%,-50%) scale(0.9)";


    setTimeout(() => {

        acceptPage.style.display =
            "none";


        acceptPage.style.transform =
            "translate(-50%,-50%)";


        document.getElementById("giftsContainer").style.display =
            "flex";


        document.getElementById("giftHeading").style.display =
            "block";

    }, 150);

}


/* ============================================================
   REJECT GIFT
============================================================ */

function rejectGift() {

    document.getElementById("acceptHeading").innerText =
        "WHY DID YOU CLICK NO!";


    document.getElementById("acceptSticker").src =
        "assets/sad.png";


    document.getElementById("acceptButtons").innerHTML = `

        <button
            id="tryAgainBtn"
            onclick="resetAcceptGift()">

            TRY AGAIN

        </button>

    `;

}


/* ============================================================
   RESET ACCEPT GIFT
============================================================ */

function resetAcceptGift() {

    document.getElementById("acceptHeading").innerText =
        "PLEASE ACCEPT THE GIFT";


    document.getElementById("acceptSticker").src =
        "assets/sticker1.png";


    document.getElementById("acceptButtons").innerHTML = `

        <button onclick="acceptGift()">
            YES
        </button>

        <button onclick="rejectGift()">
            NO
        </button>

    `;

}


/* ============================================================
   START WEBSITE
============================================================ */

loadWebsite();