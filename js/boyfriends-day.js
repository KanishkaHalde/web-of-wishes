console.log("Supabase Connected:", client);


/* ============================================================
   INPUTS
============================================================ */

const slugInput = document.getElementById("slug");

const letterBgInput = document.getElementById("letterBg");
const openCardInput = document.getElementById("openCard");
const musicCardInput = document.getElementById("musicCard");

const songInput = document.getElementById("songName");
const artistInput = document.getElementById("artistName");

const coverInput = document.getElementById("cover");
const songFile = document.getElementById("song");

const generateBtn = document.getElementById("generateBtn");


/* ============================================================
   CREATE UNIQUE FILE NAME
============================================================ */

function createFileName(file) {

    const extension =
        file.name.substring(file.name.lastIndexOf("."));

    return Date.now() + "_" + Math.random()
        .toString(36)
        .substring(2, 8) + extension;

}


/* ============================================================
   UPLOAD LETTER BACKGROUND
   Bucket: letters
============================================================ */

async function uploadLetterBg(file) {

    const fileName = createFileName(file);

    const { error } = await client.storage
        .from("letters")
        .upload(fileName, file);

    if (error) throw error;

    return `${SUPABASE_URL}/storage/v1/object/public/letters/${fileName}`;

}


/* ============================================================
   UPLOAD OPEN CARD
   Bucket: letters
============================================================ */

async function uploadOpenCard(file) {

    const fileName = createFileName(file);

    const { error } = await client.storage
        .from("letters")
        .upload(fileName, file);

    if (error) throw error;

    return `${SUPABASE_URL}/storage/v1/object/public/letters/${fileName}`;

}


/* ============================================================
   UPLOAD MUSIC CARD
   Bucket: letters
============================================================ */

async function uploadMusicCard(file) {

    const fileName = createFileName(file);

    const { error } = await client.storage
        .from("letters")
        .upload(fileName, file);

    if (error) throw error;

    return `${SUPABASE_URL}/storage/v1/object/public/letters/${fileName}`;

}


/* ============================================================
   UPLOAD ALBUM COVER
   Bucket: covers
============================================================ */

async function uploadCover(file) {

    const fileName = createFileName(file);

    const { error } = await client.storage
        .from("covers")
        .upload(fileName, file);

    if (error) throw error;

    return `${SUPABASE_URL}/storage/v1/object/public/covers/${fileName}`;

}


/* ============================================================
   UPLOAD SONG
   Bucket: songs
============================================================ */

async function uploadSong(file) {

    const fileName = createFileName(file);

    const { error } = await client.storage
        .from("songs")
        .upload(fileName, file);

    if (error) throw error;

    return `${SUPABASE_URL}/storage/v1/object/public/songs/${fileName}`;

}


/* ============================================================
   GENERATE BOYFRIEND'S DAY WEBSITE
============================================================ */

generateBtn.addEventListener("click", async () => {

    try {

        /* =========================
           VALIDATION
        ========================= */

        if (!slugInput.value.trim()) {

            alert("Please enter a website URL name.");
            return;

        }


        if (!letterBgInput.files.length) {

            alert("Please select a letter background.");
            return;

        }


        if (!openCardInput.files.length) {

            alert("Please select an open card.");
            return;

        }


        if (!musicCardInput.files.length) {

            alert("Please select a music card.");
            return;

        }


        if (!songInput.value.trim()) {

            alert("Please enter a song name.");
            return;

        }


        if (!artistInput.value.trim()) {

            alert("Please enter an artist name.");
            return;

        }


        if (!coverInput.files.length) {

            alert("Please select an album cover.");
            return;

        }


        if (!songFile.files.length) {

            alert("Please select a song.");
            return;

        }


        /* =========================
           CREATE SLUG
        ========================= */

        const slug = slugInput.value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");


        if (!slug) {

            alert("Please enter a valid website URL name.");
            return;

        }


        /* =========================
           CHECK IF SLUG EXISTS
        ========================= */

        const { data: existing, error: checkError } =
            await client
                .from("boyfriends_day_websites")
                .select("id")
                .eq("slug", slug)
                .maybeSingle();


        if (checkError) throw checkError;


        if (existing) {

            alert(
                "This website URL name already exists. Please choose another."
            );

            return;

        }


        /* =========================
           DISABLE BUTTON
        ========================= */

        generateBtn.disabled = true;

        generateBtn.innerText = "Uploading...";


        /* =========================
           UPLOAD FILES
        ========================= */

        const letterBgURL =
            await uploadLetterBg(
                letterBgInput.files[0]
            );


        const openCardURL =
            await uploadOpenCard(
                openCardInput.files[0]
            );


        const musicCardURL =
            await uploadMusicCard(
                musicCardInput.files[0]
            );


        const coverURL =
            await uploadCover(
                coverInput.files[0]
            );


        const songURL =
            await uploadSong(
                songFile.files[0]
            );


        /* =========================
           SAVE TO DATABASE
        ========================= */

        const { data, error } =
            await client
                .from("boyfriends_day_websites")
                .insert({

                    slug: slug,

                    song_title:
                        songInput.value.trim(),

                    artist_name:
                        artistInput.value.trim(),

                    album_cover:
                        coverURL,

                    song_url:
                        songURL,

                    letter_bg:
                        letterBgURL,

                    open_card:
                        openCardURL,

                    music_card:
                        musicCardURL

                })
                .select()
                .single();


        if (error) throw error;


        console.log(
            "Boyfriend's Day Website Created:",
            data
        );


        /* =========================
           CREATE WEBSITE LINK
        ========================= */

        const websiteLink =
            `${window.location.origin}/boyfriends-day/${slug}`;


        console.log(
            "Website Link:",
            websiteLink
        );


        alert(
            "Boyfriend's Day Website Generated Successfully! ❤️"
        );


        /* =========================
           OPEN GENERATED WEBSITE
        ========================= */

        window.location.href =
            websiteLink;

    }

    catch (err) {

        console.error(
            "Boyfriend's Day Error:",
            err
        );

        alert(
            err.message ||
            "Something went wrong."
        );

    }

    finally {

        generateBtn.disabled = false;

        generateBtn.innerText =
            "🚀 Generate Boyfriend's Day Website";

    }

});