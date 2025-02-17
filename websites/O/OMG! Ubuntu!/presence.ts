const presence = new Presence({
		clientId: "901490472046968843",
	}),
	pages: Record<string, string> = {
		"/": "Home",
		"/about-us": "About",
		"/commenting-conduct": "Code of Conduct",
		"/privacy-policy": "Privacy Policy",
		"/tip": "Contact",
	},
	startTimestamp = Math.round(Date.now() / 1000);

presence.on("UpdateData", async () => {
	const page = location.pathname,
		presenceData: PresenceData = {
			largeImageKey: "omgubuntu-logo",
			startTimestamp,
		},
		header = document
			.querySelector("div.u--box.content-container > div.loop > header > h2")
			?.lastChild.textContent.trim()
			.replaceAll("“|”", ""),
		articleHeader =
			document.querySelector("div.post__hero > div.u--box > header > h1")
				?.textContent ||
			document.querySelector(
				"div.u--box > div.primary > article.type-post > header > h1"
			)?.textContent;

	if (page.includes("/tag/")) {
		presenceData.details = "Looking at a tag:";
		presenceData.state = header || "Unknown Tag";
	} else if (page.includes("/category/")) {
		presenceData.details = "Looking at a category:";
		presenceData.state = header || "Unknown Category";
	} else if (page.includes("/page/")) {
		presenceData.details = "Looking at article pages";
		presenceData.state = `Page: ${
			location.pathname.split("/")[2] || "Unknown"
		}`;
	} else if (page === "/" && location.search?.includes("?s=")) {
		presenceData.details = "Searching for:";
		presenceData.smallImageKey = "search";
		presenceData.smallImageText = "Searching";
		presenceData.state =
			decodeURI(location.search).replace("?s=", "").replaceAll("+", " ") ||
			"Unknown Search";
	} else if (page.includes("/") && articleHeader) {
		presenceData.details = "Reading an article:";
		presenceData.smallImageKey = "reading";
		presenceData.smallImageText = "Reading";
		presenceData.state = articleHeader;
		presenceData.buttons = [{ label: "Read Article", url: location.href }];
	} else if (pages[page])
		presenceData.details = `Looking at the ${pages[page]} page`;

	presence.setActivity(presenceData);
});
