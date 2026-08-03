console.log("Welcome to Web Of Wishes");

console.log("Client =", client);

// =========================
// Elements
// =========================

const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("search");

// =========================
// Load Websites
// =========================

async function loadWebsites() {

    const { data, error } = await client
        .from("birthday_websites")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);
        return;

    }

    displayWebsites(data);
console.log(data);
console.log(error);
}

// =========================
// Display Table
// =========================

function displayWebsites(websites) {

    tableBody.innerHTML = "";

    if (websites.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    No websites found.
                </td>
            </tr>
        `;

        return;

    }

    websites.forEach(site => {

        tableBody.innerHTML += `
        <tr>

            <td>${site.slug}</td>

            <td>${site.song_title}</td>

            <td>${site.artist_name}</td>

            <td>
                <a
                    href="../templates/birthday/index.html?slug=${site.slug}"
                    target="_blank"
                    class="link">
                    View
                </a>
            </td>

            <td>

                <div class="actions">

    <button
        class="view"
        onclick="openWebsite('${site.slug}')">
        Open
    </button>

    <button
        class="copy"
        onclick="copyLink('${site.slug}')">
        Copy
    </button>

    <button
        class="qr"
        onclick="showQR('${site.slug}')">
        QR
    </button>

    <button
        class="delete"
        onclick="deleteWebsite('${site.id}')">
        Delete
    </button>

</div>

            </td>

        </tr>
        `;

    });

}

// =========================
// Copy Link
// =========================

function copyLink(slug) {

    const link =
`${window.location.origin}/templates/birthday/index.html?slug=${slug}`;

    navigator.clipboard.writeText(link)
.then(() => {

    alert("Website Link Copied!");

})
.catch(err => {

    console.error(err);

});

}
function openWebsite(slug){

    window.open(
        `../templates/birthday/index.html?slug=${slug}`,
        "_blank"
    );

}

function showQR(slug){

    const website =
`${window.location.origin}/templates/birthday/index.html?slug=${slug}`;

    const qr =
`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(website)}`;

    window.open(qr,"_blank");

}
// =========================
// Delete Website
// =========================

async function deleteWebsite(id) {

    if (!confirm("Delete this website?")) return;

    const { error } = await client
        .from("birthday_websites")
        .delete()
        .eq("id", id);

    if (error) {

        alert(error.message);
        return;

    }

    loadWebsites();

}

// =========================
// Search
// =========================

searchInput.addEventListener("input", async () => {

    const keyword = searchInput.value.toLowerCase();

    const { data, error } = await client
    .from("birthday_websites")
    .select("*");

if(error){

    console.error(error);
    return;

}

    const filtered = data.filter(site =>
        site.slug.toLowerCase().includes(keyword)
    );

    displayWebsites(filtered);

});

// =========================
// Start
// =========================

loadWebsites();