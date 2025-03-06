interface User {
  id: number,
  name: string,
  email: string,
  phone: string,
  company: {
    name: string;
  };
}

interface Post {
  title: string;
}


const heading = document.getElementById('heading') as HTMLElement;
const loadButton = document.getElementById('load-button') as HTMLButtonElement;
const userList = document.getElementById('user-list') as HTMLElement;
const userDetails = document.getElementById('user-details') as HTMLElement;
const loader = document.getElementById('loader') as HTMLElement;

async function fetchUsers() : Promise<void> {
  try {
    loadButton.classList.add('hidden');
    loader.classList.remove('hidden');

    let usersResponse = await fetch(`https://jsonplaceholder.typicode.com/users`);
    if (!usersResponse.ok) {
      throw new Error('Users not found');
    }
    let users: User[] = await usersResponse.json();

    loader.classList.add('hidden')
    heading.classList.remove('hidden');

    displayUsers(users);
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayUsers(users: User[]): void{
  userList.innerHTML = '';
  users.forEach((user) => {
    let li = document.createElement('li') as HTMLElement;
    li.textContent = user.name;
    li.onclick = () => fetchUserDetails(user.id);
    userList.appendChild(li);
  });
}

async function fetchUserDetails(userId: number): Promise<void> {
  try {
    loader.classList.remove('hidden');

    let userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    if (!userResponse.ok) {
      throw new Error('User not found');
    }
    let user: User = await userResponse.json();

    let postsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    if (!postsResponse.ok) {
      throw new Error('Posts not found');
    }
    let posts: Post[] = await postsResponse.json();

    loader.classList.add('hidden');
    displayUserDetails(user, posts);
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayUserDetails(user: User, posts: Post[]): void {
  userDetails.innerHTML = `
    <h2>${user.name}</h2>
    <p>Email: ${user.email}</p>
    <p>Phone number: ${user.phone}</p>
    <p>Company: ${user.company.name}</p>
    <ul>${posts.slice(0, 3).map(post => `<li>${post.title}</li>`).join('')}</ul>
  `;
  userDetails.classList.remove('hidden');
}