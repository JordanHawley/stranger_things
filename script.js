const BASE_URL =
  "https://strangers-things.herokuapp.com/api/2102-cpu-rm-web-pt";

let currentRunningNumber = 1;

//FETCHES THE POSTS
async function fetchPosts() {
  const url = `${BASE_URL}/posts`;

  try {
    const response = await fetch(url);
    const { data } = await response.json();
    // console.log(data)
    return data.posts;
  } catch (error) {
    console.error(error);
  }
}

//FETCHES AND RENDERS THE POSTS TO THE SCREEN
const fetchAndRender = async () => {
  const posts = await fetchPosts();
  // console.log(posts)
  renderPostsLinks(posts);
};

//FETCHES AND RENDERS MY POSTS
const fetchAndRenderMyPosts = async () => {
  const me = await fetchMe()
  // console.log(me)
  renderMyPostsLinks(me.posts)
}

//MODAL THAT DISPLAYS FURTHER INFORMATION ABOUT THE POST
$("#userposts").on("click", ".list-group-item", function () {
  $("#postModal").modal("show");
  let post = $(this).data("post");
  // console.log(post)
  $(".modal-header").html(
    `<h3>Poster: ${post.author.username}<br><hr><b>${post.title}<b></h3>`
  );
  $(".modal-body").html(
    `<h5>${post.description}</h5>
    <br>
    <h5>Location: ${post.location}</h5>
    <br>
    <h5>Delivery: ${post.willDeliver === true ? "YES" : "NO"}</h5>
    <br>
    <h6><em><b>Price: ${post.price}<b></em></h6>`
  );
  // $('.modal-footer').html(
  //   `${post.}`
  // )
  $("#primaryButton").hide();
});

//MODAL FOR REGISTERING A NEW USER ACCOUNT
$("#navbarSupportedContent").on("click", "#registerUser", function () {
  $("#postModal").modal("show");
  $(".modal-header").html(
    '<h3 class="registerUserTitle">Register New User Account</h3>'
  );
  $(".modal-body").html(registerUserModalHTML());
  $(".modal-footer").hide("#primaryButton");
  // console.log($(".modal-body"));
});

//MODAL FOR LOGGING IN WITH A USER ACCOUNT
$("#navbarSupportedContent").on("click", "#signIn", function () {
  // console.log("test");
  $("#postModal").modal("show");
  $(".modal-header").html(
    '<h3 class="loginUserTitle">Login to your Account</h3>'
  );
  $(".modal-body").html(loginUserModalHTML());
  $(".modal-footer").hide("#primaryButton");
});

//MODAL FOR CREATING A NEW POST WHILE LOGGED INTO ACCOUNT
$("#navbarSupportedContent").on("click", "#newPost", function () {
  // console.log("test");
  $("#postModal").modal("show");
  $(".modal-header").html(
    '<h3 class="createNewPostTitle">Create A New Post</h3>'
  );
  $(".modal-body").html(createNewPostHTML());
  $(".modal-footer").hide("#primaryButton");
});

//FUNCTION THAT LOOPS THROUGH ALL POSTS/RENDERS THEM TO THE SCREEN WHEN INVOKED
function renderPostsLinks(posts) {
  posts.forEach(function (post) {
    const postElement = createPostHTML(post);
    $("#userposts").append(postElement);
  });
  // console.log(posts); //Posts that have been saved to the database
}

//GOES THROUGH ALL OF MY POSTS AND RENDERS THEM TO THE MYPOST MODAL
function renderMyPostsLinks(posts) {
  posts.forEach(function (post) {
    const postElement = createMyPostHTML(post)
    $('.modal-body').append(postElement)
  })
}

// function renderMyMessages(posts) {
//   posts.forEach(function (message) {

//   })
// }



//FUNCTION THAT OPENS A MODAL TO USERS OWNED POSTS
$("#navbarSupportedContent").on("click", "#myPosts", function () {
  // console.log("test");
  $("#postModal").modal("show");
  $(".modal-header").html(
    '<h3 class="listMyPostsTitle">List of My Posts</h3>'
  );
  $(".modal-body").html(
    fetchAndRenderMyPosts()
  );
  $(".modal-footer").hide("#primaryButton");
});

//WHEN MYPOST IS CLICKED ON IT WILL DISPLAY A LIST OF MESSAGES FOR THAT POST
$('.modal-body').on('click', '.list-group-item', function() {
  const post = ($(this).data('myPost'))
  console.log(post)
  $('#postModal').modal('show')
  $(".modal-header").html(
    `${post.messages[0] ? `<h3 class="MyPostsMessageTitle">Message for ${post.title}</h3>` : `<h2>There are no Messages</h2>`}`
  );
  $(".modal-body").html(
    `${post.messages[0] ? `<h4>${post.messages[0].fromUser.username}</h4>-<h5>"${post.messages[0].content}"</h5><hr>`: ""}`
  );
  $(".modal-footer").show()
  $(".modal-footer").html(`<button id="backButton" type="button" 
        class="btn btn-secondary" data-bs-dismiss="modal">
          Back to Messages
        </button>

<button id="primaryButton" type="button" class="btn btn-primary">
  Message
</button>`);

// If post.messages.length > 0 {
//   let parentContainer = $(`<div>`)
//  for (let i = 0; i < post.messages.length; i++) {
//   let currentMesage = post.messages[i]
// Create a child element that utilizes the data in that message to render whatever you want
// Then append that element you just created to the parentContainer element 
//  } 
// }
// Append the parentContainer element to whatever modal you want to append it to
})


$('modal-footer').on('click', '#backButton', function() {
  $("#postModal").modal("show");
  $(".modal-header").html(
    '<h3 class="listMyPostsTitle">List of My Posts</h3>'
  );
  $(".modal-body").html(
    fetchAndRenderMyPosts()
  );
  $(".modal-footer").hide("#primaryButton");
})

//FUNCTION TO FETCH THE DATA FROM ME
const fetchMe = async () => {
  const url = `${BASE_URL}/users/me`
  const token = JSON.parse(localStorage.getItem("token"))

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
    const { data } = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

//FUNCTION TO CREATE THE POST HTML BUTTON
const createPostHTML = (post) => {
  return $(`<h4 id="postToggle" class="btn btn-primary list-group-item list-group-item-action">
   Author: ${post.author.username} / ${post.title} / Will Deliver: ${
    post.willDeliver === true ? "YES" : "NO"
  } 
  </h4>`).data("post", post);
};

//CREATE MY POSTS HTML BUTTON
const createMyPostHTML = (post) => {
  return $(`<h4 id="postToggle" class="btn btn-primary list-group-item list-group-item-action">
   Post Title: ${post.title} / Will Deliver: ${
    post.willDeliver === true ? "YES" : "NO"
  } / Price: ${post.price}
  </h4>`).data("myPost", post);
}

//FUCNTION TO CREATE THE NEW POST MODAL AND UPDATE THE MODAL IN THE HTML
const createNewPostHTML = () => {
  return `<div class="newPost">
  <form>
    <div class="mb-3 mt-4">
      <label for="post-title" class="form-label">Post Title</label>
      <input id="post-title" class="form-control" type="text" required>
    </div>

    <div class="mb-3">
      <label for="post-description" class="form-label">Post Description</label>
      <textarea id="post-description" class="form-control"  rows="4" cols="50" required></textarea>
    </div>

    <div class="mb-3">
      <label for="post-price" class="form-label">Price</label>
      <input id="post-price" class="form-control" type="text" required>
    </div>

    <div class="mb-3">
      <label for="post-willDeliver" class="form-label">Will Deliver</label>
      <input id="post-willDeliver" class="form-control" type="text" placeholder="Enter 'True' or 'False'" required>
    </div>

    <button id="newPostButton" type="submit" class="btn btn-primary">Submit</button>

  </form>

</div>`
}

//FUCNTION TO CREATE THE REGISTER MODAL AND UPDATE THE MODAL IN THE HTML
const registerUserModalHTML = () => {
  return `<div class="register" style="width: 18rem;">
  <form>
      <div class="form-group">
          <label class="usernameLabel" for="registerInputUsername">Username</label>
          <input
              type="text"
              class="form-control"
              id="registerInputUsername"
              aria-describedby="usernameHelp"
              placeholder="Enter username"
          />
      </div>
      <div class="form-group">
          <label class="passwordLabel" for="registerInputPassword">Password</label>
          <input
              type="password"
              class="form-control"
              id="registerInputPassword"
              placeholder="Password"
          />
      </div>
      <button id="registerUserSubmitButton" type="submit" class="btn btn-primary">Submit</button>
  </form>
</div>`;
};

//FUCNTION TO CREATE THE LOGIN MODAL AND UPDATE THE MODAL IN THE HTML
const loginUserModalHTML = () => {
  return `<div class="login" style="width: 18rem;">
  <form>
      <div class="form-group">
          <label class="usernameLabel" for="loginInputUsername">Username</label>
          <input
              type="text"
              class="form-control"
              id="loginInputUsername"
              aria-describedby="usernameHelp"
              placeholder="Enter username"
          />
      </div>
      <div class="form-group">
          <label class="passwordLabel" for="loginInputPassword">Password</label>
          <input
              type="password"
              class="form-control"
              id="loginInputPassword"
              placeholder="Password"
          />
      </div>
      <button id="userSubmitButton" type="submit" class="btn btn-primary">Submit</button>
  </form>
</div>`;
};

///////////////////REGISTER FUNCTIONS TO FETCH, SUBMIT AND HIDE MODAL//////////////////////////
const registerUser = async (usernameValue, passwordValue) => {
  const url = `${BASE_URL}/users/register`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          username: usernameValue,
          password: passwordValue,
        },
      }),
    });
    const {
      data: { token },
    } = await response.json();
    console.log(token);
    localStorage.setItem("token", JSON.stringify(token))
    $('#loggedInUser').html(usernameValue)
    hideRegistrationModal()
  } catch (error) {
    console.error(error);
  }
};

$(".modal-body").on("submit", ".register form", (event) => {
  event.preventDefault();
  const username = $("#registerInputUsername").val();
  const password = $("#registerInputPassword").val();
  registerUser(username, password);
});

const hideRegistrationModal = () => {
  const token = localStorage.getItem("token");
  if (token) {
    $("#postModal").modal("hide");
    $('#newPost').css('display', "block")
    $('#myPosts').css('display', "block")
    $('#signIn').hide()
    $('#registerUser').hide()
  } else {
    console.log("nothing to hide");
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////FUNCTIONS TO LOGIN, SUBMIT LOGIN, HIDE MODAL//////////////////////////
const loginUser = async (usernameValue, passwordValue) => {

  const url = `${BASE_URL}/users/login`;
  try {
      const response = await fetch(url, { 
          method: "POST",
          body: JSON.stringify(
            {
            user: { 
              username: usernameValue,
              password: passwordValue
          }
        }),
          headers: {
              "Content-Type": "application/json"
          }
      });
      const { data: {token} } = await response.json();
      localStorage.setItem("token", JSON.stringify(token))
      $('#loggedInUser').html(usernameValue)
      hideLoginModal()
  } catch(error) {
      console.error(error);
  }
} 

$(".modal-body").on("submit", ".login form", (event) => {
  event.preventDefault();
  const username = $("#loginInputUsername").val();
  const password = $("#loginInputPassword").val();
  loginUser(username, password);
});

const hideLoginModal = () => {
  const token = localStorage.getItem("token");
  if (token) {
    $("#postModal").modal("hide");
    $('#newPost').css('display', "block")
    $('#myPosts').css('display', "block")
    $('#signIn').hide()
    $('#registerUser').hide()
  } else {
    console.log("nothing to hide");
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////FUNCTIONS TO CREATE NEW POST AND SUBMIT//////////////////////////
const createNewPost = async (requestBody) => {
  const url = `${BASE_URL}/posts`
  const token = JSON.parse(localStorage.getItem("token"))

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    })
    const result = await response.json()
    hideNewPostModal()
    return result
  } catch (error) {
    console.log(error)
  }
}

$('.modal-body').on("submit", ".newPost form", async (event) => {
  event.preventDefault()
  const postTitle = $('#post-title').val()
  const postDescription =$('#post-description').val()
  const postPrice = $('#post-price').val()
  const postWillDeliver = $('#post-willDeliver').val()
  

  const requestBody = {
    post: {
      title: postTitle,
      description: postDescription,
      price: postPrice,
      willDeliver: postWillDeliver.toLowerCase()
    }
  }
  try {
   await createNewPost(requestBody)
   fetchAndRender()
  } catch (error) {
    console.log(error)
  }
})

const hideNewPostModal = () => {
  $('#postModal').modal('hide')
}
////////////////////////////////////////////////////////////////////////////////////////////////

fetchAndRender()

// <p>Will Deliver:</p>

 // <div class="form-check">
    //   <input class="form-check-input" type="radio" name="flexRadioDefault" id="willDeliverTrue" value="True">
    //   <label class="form-check-label" for="willDeliverTrue">
    //     True
    //   </label>
    // </div>

    // <div class="form-check">
    //   <input class="form-check-input" type="radio" name="flexRadioDefault" id="willDeliverFalse" value="False">
    //  <label class="form-check-label" for="willDeliverFalse">
    //     False
    //  </label>
    // </div>
