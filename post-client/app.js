const requests = new Requests();
//object to store the retrieved posts
let allPosts = [];
//object to store the selected post
let selectedPost = null;
//references for the buttons
let deleteButton = document.getElementById("btn-delete-post");
deleteButton.addEventListener("click", deletePost);
let editButton = document.getElementById("btn-edit-post");
editButton.addEventListener("click", editPost);

// When the page loads, fetch the posts and display them
window.addEventListener("load", () => {
  requests
    .get("https://jsonplaceholder.typicode.com/posts/")
    .then((posts) => {
      allPosts = posts;
      console.log(allPosts);
      displayPosts(allPosts);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Function to display posts in the div with id "posts"
function displayPosts(posts) {
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";
  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.textContent = `Id:${post.id} ${post.title}\n${post.body}`;
    postElement.addEventListener("click", () => {
      setSelectedPost(post.id);
    });
    postsDiv.appendChild(postElement);
  });
}
//function which takes an id and sets the selected post to the post with that id
//this function will also move the information from that post into the form for editing
function setSelectedPost(postId) {
  //set the selected post to the post that matches postId
  selectedPost = allPosts.find((post) => post.id === postId);
  //log just to make sure
  console.log(selectedPost);
  // Set the values in the Edit Post form
  const editForm = document.getElementById("edit-post-form");
  editForm.elements["editTitle"].value = selectedPost.title;
  editForm.elements["editContent"].value = selectedPost.body;
  editForm.elements["editId"].value = selectedPost.id;
  editForm.elements["userId"].value = selectedPost.userId;
}
//function that fires when a post is edited
function editPost(event) {
  //do not submit the form
  event.preventDefault();
  //make sure a post is selected
  if (selectedPost === null) {
    alert("You must select a post to edit");
    return;
  }
  //get the data from the edit post form
  const editForm = document.getElementById("edit-post-form");
  const editTitle = editForm.elements["editTitle"].value;
  const editContent = editForm.elements["editContent"].value;
  const editId = editForm.elements["editId"].value;
  const userId = editForm.elements["userId"].value;
  //create an object with the updated post data
  const updatedPost = {
    id: editId,
    title: editTitle,
    body: editContent,
    userId: userId,
  };
  //make a put request including the updated post
  requests
    .put(`https://jsonplaceholder.typicode.com/posts/${editId}`, updatedPost)
    .then((response) => {
      console.log(response);
      // Update the selected post with the updated values
      selectedPost.title = editTitle;
      selectedPost.body = editContent;
      //update all posts with the updated post
      allPosts = allPosts.map((post) => {
        if (post.id === selectedPost.id) {
          return selectedPost;
        } else {
          return post;
        }
      });
      // Display the updated post
      displayPosts(allPosts);
    })
    .catch((err) => {
      console.log(err);
    });
}
//function that fires when a post is deleted
function deletePost(event) {
  event.preventDefault();
  if (selectedPost === null) {
    alert("You must select a post to delete");
    return;
  }
  const editForm = document.getElementById("edit-post-form");
  const editId = editForm.elements["editId"].value;
  requests
    .delete(`https://jsonplaceholder.typicode.com/posts/${editId}`)
    .then((response) => {
      console.log(response);
      //remove the selected post from all posts
      allPosts = allPosts.filter((post) => post.id !== selectedPost.id);
      // Display the updated post
      displayPosts(allPosts);
    })
    .catch((err) => {
      console.log(err);
    });
}
