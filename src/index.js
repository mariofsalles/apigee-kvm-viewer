/**
 * You MUST set this values before using 
 */
const ORG = ""
const ENV = ""
const TOKEN = ""

// Instanciate axios
const apigee = axios.create({
    baseURL: "https://apigee.googleapis.com",
    timeout: 2000,
    headers: { Authorization: `Bearer ${TOKEN}` },
});

// KVM operations
const listKvms = async () => {
    try {
        const response = await apigee.get(
            `/v1/organizations/${ORG}/environments/${ENV}/keyvaluemaps`
        );
        let kvms = response.data;
        kvms = kvms.map((kvm, i) => ({ id: i, name: kvm }));

        return { items: kvms };
    } catch (error) {
        console.log(error);
        alert('Error: Missing or invalid token')
    }
};
const createKvm = async (kvm) => {
    try {
        console.log(kvm);
        const body = { name: kvm, encrypted: true };
        const response = await apigee.post(
            `/v1/organizations/${ORG}/environments/${ENV}/keyvaluemaps/`,
            body
        );
        window.location.href = window.location.href;
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
const removeKvm = async (kvm) => {
    try {
        const response = await apigee.delete(`/v1/organizations/${ORG}/environments/${ENV}/keyvaluemaps/${kvm}`);
        window.location.href = window.location.href;
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Entries operations
const listEntriesKvms = async (kvm) => {
    try {
        const response = await apigee.get(
            `/v1/organizations/${ORG}/environments/${ENV}/keyvaluemaps/${kvm}/entries`
        );
        return response.data.keyValueEntries;
    } catch (error) {
        console.error(error);
    }
};
const createEntry = async (kvm, name, value) => {
    try {
        console.log(kvm, name, value);
        const body = { name: name, value: value };
        const response = await apigee.post(`/v1/organizations/${ORG}/environments/${ENV}/keyvaluemaps/${kvm}/entries`, body);
        window.location.href = window.location.href;
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
const removeEntry = async (kvm, entry) => {
    try {
        const response = await apigee.delete(`/v1/organizations/${ORG}/environments/${ENV}/keyvaluemaps/${kvm}/entries/${entry}`);
        window.location.href = window.location.href;
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

//UI Functions
async function renderHomePage() {
    // Define the data for the list view
    const kvmsList = await listKvms();
    var templateSource = document.getElementById("list-template").innerHTML;
    var template = Handlebars.compile(templateSource);

    // Render the list view and insert it into the DOM
    const listHtml = template(kvmsList);
    document.getElementById("list-view").innerHTML = listHtml;

    var html = template(kvmsList);
    document.getElementById("list-view").innerHTML = html;

    const listItems = document.querySelectorAll("#list-view li");

    listItems.forEach((item) => {
        item.addEventListener("click", () => getEntriesKvm(item.textContent));
    });
}
async function getEntriesKvm(kvm) {
    document.getElementById("list-view").style.display = "none";

    const entryList = await listEntriesKvms(kvm);
    console.log(entryList);

    // Compile the table template
    const templateSource = document.getElementById("table-template").innerHTML;
    const template = Handlebars.compile(templateSource);

    // Render the table template with the entryList data
    const entriesHtml = template({ kvm: kvm, items: entryList });

    // Insert the resulting HTML into the table-view element
    const tableView = document.getElementById("table-view");
    tableView.style.display = "block";
    tableView.innerHTML = entriesHtml;

    const addEntryBtn = document.getElementById("add-entry-btn");
    addEntryBtn.addEventListener("click", () => {
        let entries = document.getElementById("entries").value;
        JSON.parse(entries).forEach((entry) => {
            if(entry.name === "" || entry.value === "" || typeof entry.name !== "string"|| typeof entry.value !== "string")
                return alert("Empty or invalid entries format")

            createEntry(kvm, entry.name, entry.value);
        });
    });

    const deleteEntryBtn = document.getElementById("delete-entry-kvm-btn");
    deleteEntryBtn.addEventListener("click", () => {
        const entry = prompt("Confirm Entry name (This action can't be undone):");
        removeEntry(kvm, entry);
    })

}
function addEntryKvmPopup() {
    document.getElementById("list-view").style.display = "none";
    document.getElementById("content-view").style.display = "block";
    document.getElementById("popup").style.display = "flex";
}
function cancelEntryKvm() {
    document.getElementById("entries").value = "";
    document.getElementById("list-view").style.display = "none";
    document.getElementById("content-view").style.display = "block";
    document.getElementById("popup").style.display = "none";
}
function returnHomePage() {
    window.location.href = window.location.href;
}
function addKvm() {
    const kvm = prompt("KVM name:");
    createKvm(kvm);
}
function deleteKvm() {
    const kvm = prompt("Confirm KVM name (This action can't be undone):");
    removeKvm(kvm);
}