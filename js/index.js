const githubSearchForm = document.querySelector('#github-form');
const userList = document.querySelector('#user-list');
const reposList = document.querySelector('#repos-list');
const githubURL = "https://api.github.com/search/"
const toggleUsersRepos = document.querySelector("#toggle-users-repos");
let userSearch = true;


function githubSearchListener() {
    githubSearchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = githubSearchForm.querySelector('#search').value
        if (userSearch) {
            searchGithubForUser(searchTerm);
            githubUserReposListener();
        } else {
            userList.removeEventListener("click", renderUserRepos);
            searchGithubForRepos(searchTerm);
        }

    });
    toggleUsersRepos.addEventListener('click', function(e) {
        e.preventDefault();
        if (userSearch) {
            toggleUsersRepos.innerText = "Repos"
            userSearch = false;
        } else {
            toggleUsersRepos.innerText = "Users"
            userSearch = true;
        }
    })
}

function searchGithubForUser(searchTerm) {
    const searchObj = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json'
        }
    }
    fetch(githubURL + `users?q=${searchTerm}`, searchObj)
        .then(resp => {
            return resp.json()
        })
        .then(function(data) {
            clearUserList();
            clearReposList();
            data.items.forEach(function(item) {
                userList.insertAdjacentHTML('beforeend', userToHTML(item));
            });
        });
}

function userToHTML(user) {
    const userHTML = `
        <li class="user" data-name="${user.login}">
            <h3><a href="${user.html_url}">${user.login}</a></h3>
            <img src="${user.avatar_url}">
        </li>
    `
    return userHTML;
}

function searchGithubForRepos(searchTerm) {
    const searchObj = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.mercy-preview+json'
        }
    }
    fetch(githubURL + `repositories?q=${searchTerm}`, searchObj)
        .then(resp => {
            return resp.json()
        })
        .then(function(data) {
            clearUserList();
            clearReposList();
            data.items.forEach(function(item) {
                userList.insertAdjacentHTML('beforeend', reposToHTML(item));
            });
        });

}

function githubUserReposListener() {
    userList.addEventListener("click", renderUserRepos)
}

function renderUserRepos(e) {
    if (e.target.closest('li')) {
        searchGithubForUserRepos(e.target.closest('li').dataset.name)
    }
}

function searchGithubForUserRepos(name) {
    const githubReposURL = `https://api.github.com/users/${name}/repos`;
    const searchObj = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json'
        }
    }
    fetch(githubReposURL, searchObj)
        .then(resp => {
            return resp.json()
        })
        .then(function(data) {
            clearReposList();
            data.forEach(function(datum) {
                reposList.insertAdjacentHTML('beforeend', reposToHTML(datum));
            });
        });

}

function clearReposList() {
    reposList.innerHTML = "";
}

function clearUserList() {
    userList.innerHTML = "";
}

function reposToHTML(repo) {
    const repoHTML = `
        <li class="repo">
            <h3><a href="${repo.html_url}">${repo.name}</a></h3>
            <h4>Description: ${repo.description}</h4
            <h4>Forks: ${repo.forks_count}</h4
        </li
    `
    return repoHTML;
}

githubSearchListener();