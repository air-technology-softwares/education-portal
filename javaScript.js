 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyDDTCy4QhOfr2p66moFqoVqxmJAt7NxgrI",
    authDomain: "air-technology-education.firebaseapp.com",
    databaseURL: "https://air-technology-education-default-rtdb.firebaseio.com",
    projectId: "air-technology-education",
    storageBucket: "air-technology-education.appspot.com",
    messagingSenderId: "524849959120",
    appId: "1:524849959120:web:86fa14bb300c5347fb0ed5"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const database = firebase.database();
  const auth = firebase.auth();
  const storage = firebase.storage();
  var uidStorage = '';

  function fswitch(){
      var page1 = document.getElementById('login');
      var page2 = document.getElementById('forgot');

      if(page1.style.display === 'block'){
          page1.style.display = 'none';
          page2.style.display = 'block';
      }
      else{
          page2.style.display = 'none';
          page1.style.display = 'block';
      }
  }

  function cswitch(){
    var page1 = document.getElementById('login');
    var page2 = document.getElementById('create');

    if(page1.style.display === 'block'){
        page1.style.display = 'none';
        page2.style.display = 'block';
    }
    else{
        page2.style.display = 'none';
        page1.style.display = 'block';
    }
}

  async function userLogin(){
      var email = document.getElementById('lemail').value;
      var pass = document.getElementById('lpass').value;

      if(email === '' && pass === ''){
          alert('Kindly enter all entery')
      }
      else{
          auth.signInWithEmailAndPassword(email, pass)
          .then(async function(){
              var user = auth.currentUser;

              console.log(user.uid);

              await database.ref('users/' + user.uid + '/').update({
                  'last_login':Date.now()
              })

              window.dashLoad();

              uidStorage = user.uid;

              window.location = 'Dashboard.html';
          })

          .catch(async function(error){
              var error_code = error.code;
              var error_message = error.message;

              alert(error_message);
          })

      }
  }

  async function userForgot(){
      var email = document.getElementById('femail').value;

      if(email === ''){
          alert('Please Enter An Email');
      }
      else{
          auth.sendPasswordResetEmail(email)

          .then(async function(){
              alert('Link Sent Kindly Check Your Mail')
          })

          .catch(async function(){
            var error_code = error.code;
            var error_message = error.message;

            alert(error_message);
          })
      }
  }

 async function userCreate(){
     var email = document.getElementById('cemail').value;
     var name = document.getElementById('cname').value;
     var phone = document.getElementById('cphone').value;
     var pass = document.getElementById('cpass').value;

     if(email === '' && name === '' && phone === '' && pass === ''){
         alert('No Entry Can Be Left Emty')
     }

     else{
         auth.createUserWithEmailAndPassword(email, pass)
         .then(async function(){
             var user = auth.currentUser;
             var userData = 
             {
                 email:email,
                 name:name,
                 phone:phone,
                 type:'student',
                 project:'none',
                 class:'none',
                 credit:'0',
                 last_login:Date.now(),
                 plan:'none'
             }

             await database.ref('users/' + user.uid + '/').update(userData)

             alert('User Created!')

             window.location = 'Login';
         })

         .catch(async function(error){
             var error_code = error.code;
             var error_message = error.message;

             alert(error_message);
         })
     }
 }

  async function dashLoad(){
     var user = auth.currentUser;
     var s = document.getElementById('student');
     var t = document.getElementById('teacher');
     var btn = document.getElementById('load');
     var userType;

     console.log('Working');

     console.log(uidStorage);

     await database.ref('users/' + user.uid + '/').on('value', data=>{
          userType = data.val();

          btn.style.display = 'none';

         if(userType.type === 'student'){
             s.style.display = 'block';
         }
         else if(userType.type === 'teacher'){
             t.style.display = 'block';
         }
         else{
             alert('Error while getting data!')
         }
         

     })

     
 }

 async function Project(){
     var user = auth.currentUser;
     var link;

    await database.ref('users/' + user.uid + '/').on('value', async data=>{
        link = data.val();

        if(link.project === 'none'){
            alert('You Do Not Have Any Projects Pending');
        }
        else{
            window.location = link.project;
        }
    })
 }

 async function profileLoad(){
     var userData;
     var user = auth.currentUser;
     var btn = document.getElementById('pload');

     await database.ref('users/' + user.uid + '/').on('value', data=>{
         userData = data.val();

         btn.style.display = 'none';

         document.getElementById('nam').innerHTML = userData.name;
         document.getElementById('ema').innerHTML = userData.email;
         document.getElementById('pho').innerHTML = userData.phone;
         document.getElementById('cre').innerHTML = userData.credit;
         document.getElementById('typ').innerHTML = userData.type;
         document.getElementById('pla').innerHTML = userData.plan;
     })
 }

 function ask(){
     var user = auth.currentUser;
     var userData;

     database.ref('users/' + user.uid + '/').on('value', data=>{
         userData = data.val();

         var page1 = document.getElementById('cstudent');
         var page2 = document.getElementById('nobook');
         var page3 = document.getElementById('notstart');
         var page4 = document.getElementById('cteacher');
         var btn = document.getElementById('ask');

         if(userData.credit !== 0){

         if(userData.class === 'none'){
             btn.style.display = 'none';
             page2.style.display = 'block';
         }
         else if(userData.class === 'book'){
            btn.style.display = 'none';
             page3.style.display = 'block';
         }
         else if(userData.class === 'start'){
            btn.style.display = 'none';
             page1.style.display = 'block';
         }
         else if(userData.class === 'teacher'){
            btn.style.display = 'none';
             page4.style.display = 'block';
         }
         else{
            btn.style.display = 'none';
            alert('Error! Redirecting To Dashboard');
            window.location = 'Dashboard';
         }

        }
        else{
            alert('No Credits');
            window.location = 'Dashboard';
        }
     })
 }


 async function classstart(){
     var user = auth.currentUser;
     var userUid = document.getElementById('stuid').value;

     if(userUid === ''){
         alert('Please A Student UID');
     }

     else{

     await database.ref('users/' + user.uid + '/').on('value', async data=>{
         var userData = data.val()

     database.ref('users/' + userUid + '/').set({
         class:'start',
         credit:userData.credit+1,
     })

    })
}
 }

 function classclose(){
    var user = auth.currentUser;
    var userUid = document.getElementById('stuid').value;

    database.ref('users/' + userUid + '/').update({
        class:'none'
    })
}

async function projectload(){

    var user = auth.currentUser;
    var userData;

    await database.ref('users/' + user.uid + '/').on('value', async data=>{

        userData = data.val();

    var student = document.getElementById('prstudent');
    var teacher = document.getElementById('prteacher');
    var loadbtn = document.getElementById('loadprojectbtn');

        if(userData.type === 'student'){
            student.style.display = 'block';
            loadbtn.style.display = 'none';
        }

        else if(userData.type === 'teacher'){
            teacher.style.display = 'block';
            loadbtn.style.display = 'none';

            var filescome = storage.ref('test/').listAll()
            .then(()=>{
                var note = document.getElementById('noteinpr').innerHTML = filescome;

            })
        }

        else{
            student.style.display = 'none';
            teacher.style.display = 'none';
            loadbtn.style.display = 'none';
            alert('Sorry User Is Invalid')
        }

    })

    


}