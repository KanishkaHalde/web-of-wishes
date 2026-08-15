console.log("Supabase Connected:", client);


/* ============================================================
   INPUTS
============================================================ */

const slugInput = document.getElementById("slug");

const giftBgInput = document.getElementById("giftBg");
const letterBgInput = document.getElementById("letterBg");
const bouquetBgInput = document.getElementById("bouquetBg");

const songInput = document.getElementById("songName");
const artistInput = document.getElementById("artistName");

const coverInput = document.getElementById("cover");
const songFile = document.getElementById("song");

const generateBtn = document.getElementById("generateBtn");


/* ============================================================
   UPLOAD GIFT BACKGROUND
   Bucket: gift-backgrounds
============================================================ */

async function uploadGiftBg(file) {

    const fileName =
        Date.now() + "_" + file.name;

    const { error } = await client.storage
        .from("gift-backgrounds")
        .upload(fileName, file);

    if (error) throw error;

    return `${SUPABASE_URL}/storage/v1/object/public/gift-backgrounds/${fileName}`;

}


/* ============================================================
   UPLOAD LETTER BACKGROUND
   Bucket: letter-backgrounds
============================================================ */

async function uploadLetterBg(file) {

    const fileName =
        Date.now() + "_" + file.name;

    const { error } = await client.storage
        .from("letter-backgrounds")
        .upload(fileName, file);

    if (error) throw error;

    return `${SUPABASE_URL}/storage/v1/object/public/letter-backgrounds/${fileName}`;

}


/* ============================================================
   UPLOAD BOUQUET BACKGROUND
   Bucket: bouquets
============================================================ */

async function uploadBouquetBg(file) {

    const fileName =
        Date.now() + "_" + file.name;

    const { error } = await client.storage
        .from("bouquets")
        .upload(fileName, file);

    if (error) throw error;

    return `${SUPABASE_URL}/storage/v1/object/public/bouquets/${fileName}`;

}


/* ============================================================
   UPLOAD ALBUM COVER
   Bucket: covers
============================================================ */

async function uploadCover(file) {

    const fileName =
        Date.now() + "_" + file.name;

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

    const fileName =
        Date.now() + "_" + file.name;

    const { error } = await client.storage
        .from("songs")
        .upload(fileName, file);

    if (error) throw error;

    return `${SUPABASE_URL}/storage/v1/object/public/songs/${fileName}`;

}


/* ============================================================
   GENERATE ANNIVERSARY WEBSITE
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


        if (!giftBgInput.files.length) {

            alert("Please select a gift background.");
            return;

        }


        if (!letterBgInput.files.length) {

            alert("Please select a letter background.");
            return;

        }


        if (!bouquetBgInput.files.length) {

            alert("Please select a bouquet background.");
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


        /* =========================
           CHECK IF SLUG EXISTS
        ========================= */

        const { data: existing, error: checkError } =
            await client
                .from("anniversary_websites")
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
           DISABLE BUTTON WHILE UPLOADING
        ========================= */

        generateBtn.disabled = true;

        generateBtn.innerText =
            "Uploading...";


        /* =========================
           UPLOAD ALL FILES
        ========================= */

        const giftBgURL =
            await uploadGiftBg(
                giftBgInput.files[0]
            );


        const letterBgURL =
            await uploadLetterBg(
                letterBgInput.files[0]
            );


        const bouquetBgURL =
            await uploadBouquetBg(
                bouquetBgInput.files[0]
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
           SAVE INTO DATABASE
        ========================= */

        const { data, error } =
            await client
                .from("anniversary_websites")
                .insert({

                    slug: slug,

                    gift_bg: giftBgURL,

                    letter_bg: letterBgURL,

                    bouquet_bg: bouquetBgURL,

                    song_title:
                        songInput.value.trim(),

                    artist_name:
                        artistInput.value.trim(),

                    album_cover:
                        coverURL,

                    song_url:
                        songURL

                })
                .select()
                .single();


        console.log(
            "Anniversary Website Created:",
            data
        );


        if (error) throw error;


        /* =========================
           CREATE WEBSITE LINK
        ========================= */

        const websiteLink =
            `${window.location.origin}/anniversary/${slug}`;


        console.log(
            "Website Link:",
            websiteLink
        );


        alert(
            "Anniversary Website Generated Successfully!"
        );


        window.location.href =
            websiteLink;

    }

    catch (err) {

        console.error(
            "Anniversary Error:",
            err
        );

        alert(
            err.message || "Something went wrong."
        );

    }

    finally {

        generateBtn.disabled = false;

        generateBtn.innerText =
            "Generate Anniversary Website ❤️";

    }

});