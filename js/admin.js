console.log("Supabase Connected:", client);

// =========================
// Inputs
// =========================
const slugInput = document.getElementById("slug");
const songInput = document.getElementById("songName");
const artistInput = document.getElementById("artistName");

const coverInput = document.getElementById("cover");
const songFile = document.getElementById("song");
const letterBgInput = document.getElementById("letterBg");

const previewSong = document.getElementById("previewSong");
const previewArtist = document.getElementById("previewArtist");
const coverPreview = document.getElementById("coverPreview");

const generateBtn = document.getElementById("generateBtn");

// =========================
// Live Preview
// =========================

songInput.addEventListener("input", () => {
    previewSong.textContent = songInput.value || "Song Name";
});

artistInput.addEventListener("input", () => {
    previewArtist.textContent = artistInput.value || "Artist Name";
});

// =========================
// Album Cover Preview
// =========================

coverInput.addEventListener("change", () => {

    const file = coverInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
        coverPreview.src = e.target.result;
    };

    reader.readAsDataURL(file);

});

// =========================
// Upload Album Cover
// =========================

async function uploadCover(file) {

    const fileName = Date.now() + "_" + file.name;

    const { error } = await client.storage
        .from("covers")
        .upload(fileName, file);

    if (error) throw error;

    return `${SUPABASE_URL}/storage/v1/object/public/covers/${fileName}`;

}

// =========================
// Upload Song
// =========================

async function uploadSong(file) {

    const fileName = Date.now() + "_" + file.name;

    const { error } = await client.storage
        .from("songs")
        .upload(fileName, file);

    if (error) throw error;

    return `${SUPABASE_URL}/storage/v1/object/public/songs/${fileName}`;

}

// =========================
// Upload Letter Background
// =========================

async function uploadLetterBg(file) {

    const fileName = Date.now() + "_" + file.name;

    const { error } = await client.storage
        .from("letters")
        .upload(fileName, file);

    if (error) throw error;

    return `${SUPABASE_URL}/storage/v1/object/public/letters/${fileName}`;

}

// =========================
// Generate Website
// =========================

generateBtn.addEventListener("click", async () => {

    try {

        // Validation

        if (!slugInput.value.trim()) {
            alert("Please enter a website URL name.");
            return;
        }

        if (!songInput.value.trim()) {
            alert("Please enter song name.");
            return;
        }

        if (!artistInput.value.trim()) {
            alert("Please enter artist name.");
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

        if (!letterBgInput.files.length) {
            alert("Please select a letter background.");
            return;
        }

        // ✅ Create slug HERE
        const slug = slugInput.value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");

            // Check if slug already exists
const { data: existing } = await client
    .from("birthday_websites")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

if (existing) {
    alert("This website URL name already exists. Please choose another.");
    return;
}

        // Upload Files
        const coverURL = await uploadCover(coverInput.files[0]);

        const songURL = await uploadSong(songFile.files[0]);

        const letterBgURL = await uploadLetterBg(letterBgInput.files[0]);

        // Save into Database
        const { data, error } = await client
            .from("birthday_websites")
            .insert({

                slug: slug,

                song_title: songInput.value,

                artist_name: artistInput.value,

                album_cover: coverURL,

                song_url: songURL,

                letter_bg: letterBgURL

            })
            .select()
            .single();

        console.log("Insert Data:", data);
console.log("Insert Error:", error);

if (error) throw error;

// Create Website Link using slug
const websiteLink =
`${window.location.origin}/birthday/${slug}`;

console.log("Website Created:");
console.log(websiteLink);

alert("Website Generated Successfully!");

window.location.href = websiteLink;

    } catch (err) {

        console.error(err);
        alert(err.message);

    }

});