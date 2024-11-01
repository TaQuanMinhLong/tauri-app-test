import { createResource, For, Show } from "solid-js";
import { A, useParams } from "@solidjs/router";

async function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
const fakeMap = {
	"/root/1": [
		{ user_id: "123", parent_path: "/root/1", path: "/root/2", id: "2" },
		{ user_id: "123", parent_path: "/root/1", path: "/root/3", id: "3" },
		{ user_id: "123", parent_path: "/root/1", path: "/root/4", id: "4" },
	],
} as Record<
	string,
	{ user_id: string; parent_path: string; path: string; id: string }[]
>;

const folders = [
	{ user_id: "123", parent_path: "/root", id: "1", path: "/root/1" },
	{ user_id: "123", parent_path: "/root/1", id: "2", path: "/root/2" },
	{ user_id: "123", parent_path: "/root/1", id: "3", path: "/root/3" },
	{ user_id: "123", parent_path: "/root/1", id: "4", path: "/root/4" },
];

async function getFolder(id: string) {
	await delay(100);
	return folders.find((folder) => folder.id === id);
}

async function getUser(user_id?: string) {
	await delay(100);
	return { name: `User ${user_id}`, age: 20, id: user_id } as
		| { name: string; age: number; id: string }
		| undefined;
}

async function getVideos(folder_path?: string) {
	await delay(100);
	return folder_path
		? [
				{ name: "Video 1", id: "1", folder_path },
				{ name: "Video 2", id: "2", folder_path },
				{ name: "Video 3", id: "3", folder_path },
			]
		: [];
}

async function getChildren(folder_path?: string) {
	await delay(100);
	return folder_path
		? (fakeMap[folder_path] as Partial<typeof fakeMap>[string])
		: [];
}

async function fetchData(folderPath: string) {
	const folder = await getFolder(folderPath);
	const [user, videos, children] = await Promise.all([
		getUser(folder?.user_id),
		getVideos(folder?.path),
		getChildren(folder?.path),
	]);
	return { folder, user, videos, children };
}

export default function Route() {
	const params = useParams();
	const folderPath = () => params.id;
	const [data] = createResource(folderPath, fetchData);

	return (
		<>
			<div>Folders</div>
			<Show when={data()} fallback="Loading...">
				{(data) => (
					<>
						<div class="grid gap-1">
							<For each={data().children}>
								{(child) => <A href={`/folder/${child.id}`}>{child.path}</A>}
							</For>
						</div>
						<pre>{JSON.stringify(data())}</pre>
					</>
				)}
			</Show>
		</>
	);
}
