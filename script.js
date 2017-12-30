var vitesse=Math.random()*3000 + 3000;
jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}

$(function(){

	var listObj= [],
	listShoot = [],
	timer = 0,
	gamePaused =true,
	cp_score = 0,
	soundActif = true,
	cp_fuel = 30;

	//Shoot
	var cmpshoot=1;
	function mainShipShoot(){
		var rightAirplane = $('#airplane').position().left + $('#airplane').width();
		var middleAirplane = $('#airplane').offset().top + ($('#airplane').height()/2);
		if (!gamePaused) {
			var obj = $('<div class="shoot" id="shoot'+cmpshoot+'"></div>').css({left:rightAirplane +'px',top:middleAirplane + 'px'})
			moveShoot(obj);
			obj.appendTo('#gameboared');	
			listShoot.push('shoot'+cmpshoot);
			var x = obj.position().left + obj.width();
			var y = obj.offset().top + (obj.height()/2);	
			cmpshoot++;
		}

	}
	var tms=null;
	function moveShoot(shoot){
		var cp = $('#airplane').position().left + $('#airplane').width();
		tms=window.setInterval(function(){
			if (!gamePaused) {
				cp+=3;
				shoot.css('left',cp + 'px');
				if (cp >930) {
					shoot.remove();
				}				
			}

		},1)
	}

	function enemyShipShoot(sh){
	if($('#'+sh).length!=0 && !gamePaused){
		var leftShip = $('#'+sh).position().left;
		var x = Math.floor($('#'+sh).offset().top + ($('#'+sh).height()/2));
		var obj = $('<div class="shoot1"></div>')
		obj.css('left',leftShip+'px');
		obj.css('top',x+'px');
		moveShootEnemy(obj.appendTo('#gameboared'),sh)
		}
	}
	var tmse=null;
	function moveShootEnemy(shoot,sh){
		var cp = $('#'+sh).position().left;
		tmse=window.setInterval(function(){
			if (!gamePaused) {
				cp--;
				shoot.css('left',cp + 'px');
				if (cp <0) {
					shoot.remove();
				}				
			}

		},1)
		collusionShootToAireplane($("#airplane"));
	}
    var trc=null;
	function randomShip(){
		trc=window.setInterval(function(){
			if (Tships.length > 0) {
				var x = 'ship' + Math.floor(Math.random()*Tships.length + 1);
				enemyShipShoot(x);
			}
		},Math.floor(Math.random()*2500 + 2500))

	}
	//Control button
	$('#pause').click(function(){
		if (!gamePaused) {
			$('#pause').attr('src','images/play.png')
			document.getElementById('bg-sound').pause();
			gamePaused = true;
				clearInterval(gs);
				clearInterval(ga);
				clearInterval(gf);
				clearInterval(gse);
				clearInterval(ce);
				clearInterval(cf);
				clearInterval(cs);
				clearInterval(csf);
		}
		else{
			$('#pause').attr('src','images/pause.png')
			document.getElementById('bg-sound').play();
			gamePaused = false
		}
	})

	var shoot =true;

$(window).keyup(function(e){
	shoot = true
})

	$(window).keydown(function(e){
		if (e.keyCode == 32) {
			if (shoot) {
				if (!gamePaused) {
					mainShipShoot();
					document.getElementById('shoot-music').play()
					
				}
					shoot = false;	
			}
			
		}
		if (e.keyCode == 80) {
			if (!gamePaused) {
				$('#pause').attr('src','images/play.png')
				document.getElementById('bg-sound').pause();
				gamePaused = true;
				clearInterval(gs);
				clearInterval(ga);
				clearInterval(gf);
				clearInterval(gse);
				clearInterval(ce);
				clearInterval(cf);
				clearInterval(cs);
				clearInterval(csf);
			}
			else{
				$('#pause').attr('src','images/pause.png')
				document.getElementById('bg-sound').play();
				gamePaused = false
			}			
		}
	})

	$('#volume').click(function(){
		if (!gamePaused) {
			if (soundActif) {
				soundActif = false;
				document.getElementById('bg-sound').pause();
				$('#volume').attr('src','images/mute.png')
			}
			else{
				soundActif = true;
				document.getElementById('bg-sound').play();
				$('#volume').attr('src','images/volume.png')
			}			
		}

	})
	$('#font-plus').click(function(){
		var font_timer = parseInt($('#time').css('font-size'));
		var font_score = parseInt($('#score').css('font-size'));
		font_timer+=2
		font_score+=2
		$('#time').css('font-size',font_timer+'px');
		$('#score').css('font-size',font_score+'px');
	})
	$('#font-moins').click(function(){
		var font_timer = parseInt($('#time').css('font-size'));
		var font_score = parseInt($('#score').css('font-size'));
		font_timer-=2
		font_score-=2
		$('#time').css('font-size',font_timer+'px');
		$('#score').css('font-size',font_score+'px');
	})

	//Collusion
	function collusion(e1,e2){
		var E1 = {};
		var E2 = {};
		if ($(e1).length != 0) {
			E1.top = $(e1).offset().top;
			E1.left = $(e1).offset().left;
			E1.bottom = $(e1).offset().top + $(e1).height();
			E1.right = $(e1).offset().left + $(e1).width();
		}


		E2.top = $(e2).offset().top;
		E2.left = $(e2).offset().left;
		E2.bottom = $(e2).offset().top + $(e2).height();
		E2.right = $(e2).offset().left + $(e2).width();

		if (E1.top < E2.bottom && E1.bottom > E2.top && E1.left < E2.right && E1.right > E2.left) return true;
		else return false;
	}

	//Check All collusion
	var ce = null;
	function collusionEnemy(obj){
		ce = window.setInterval(function(){
			var col = collusion($('#airplane'),obj);
			if (col) {
				document.getElementById('destroy-sound').play();
				obj.remove();
				cp_fuel-=15;
			}
		},1)
	}
	var cf = null;
	function collusionFuel(obj){
		cf = window.setInterval(function(){
			var col = collusion($('#airplane'),obj);
			if (col) {
				obj.remove();
				cp_fuel+=15;
				if (cp_fuel>30) cp_fuel = 31;
			}
		},1)
	}

	var cs = null;
	var coll=0;
	//
	var lastObj=null;
	var ListCollAstroid=[];
	function getAstroid(id){
	   var pos=-1;
	   for(var i=0; i<ListCollAstroid.length;i++){
	      if(ListCollAstroid[i]==id) pos++;
	   }
	
	  return pos;
	}
function collusionShootToAireplane(obj){
		csf = window.setInterval(function(){
			var col = collusion($('.shoot1'),obj);
			if (col) {
				$('.shoot1').remove();
				cp_score-=10;
			}
		},1)
	}
	$('#gameboared').hide();
	$('#gameover').hide();
	$('#ranking').hide();
	$('.btn_start').click(function(){
	clearTimer();
		document.getElementById('bg-sound').play();
		generateFuel()
		generate();
		gamePaused = false;
		$('#instruction').hide('slow');
		$('#gameboared').show('slow');
		// vitesse
		  vitesse=Math.random()*3000 + 3000;
		//list of
		listObjColl=[];
	})

	$('.btn_continue').click(function(){
		$('#gameover').hide('fast');
		$('#ranking').show('slow');
		var name = $('input[name="name"]').val();

		$.post('register.php' , {name:name , score:cp_score, time:timer}).done(function(data){
			var jsonData = JSON.parse(data);

			var tr;
			for(var i = 0; i < jsonData.length - 1; i++){
				for(var j = i+1; j <jsonData.length; j++){
					if (jsonData[i].score < jsonData[j].score) {
						var tmp = jsonData[i];
						jsonData[i] = jsonData[j];
						jsonData[j] = tmp;
					}
					else{
						if (jsonData[i].score == jsonData[j].score) {
							if (jsonData[i].time > jsonData[j].time) {
								var tmp = jsonData[i];
								jsonData[i] = jsonData[j];
								jsonData[j] = tmp;
							}
						}
					}
				}
				tr = $('<tr/>');
				tr.append('<td>' + parseInt(i+1) + '</td>');
				tr.append('<td>' + jsonData[i].name + '</td>');
				tr.append('<td>' + jsonData[i].score + '</td>');
				tr.append('<td>' + (editTimer(parseInt((jsonData[i].time)/60)) + ':' + editTimer((jsonData[i].time)%60)) + '</td>');
				$('#score_table table tbody').append(tr);
			}
		})
	})

	$('.btn_restart').click(function(){
	    vitesse=Math.random()*3000 + 3000;
		$('#ranking').hide('fast');
		$('#gameboared').show('slow');
		$('#airplane').css({left:0,top:'250px'})
		gamePaused = false;
		listObj = [];
		$('.ship,.astroid,.fuel').remove();
		timer = 0;
		score = 0;
		cp_fuel = 15;
		document.getElementById('bg-sound').play();
		generateFuel()
		clearTimer();
	})
	var p1=0;
	var p2=0;
	function movePlanet(){
		if (!gamePaused) {
			p1--;
			p2-=0.8;
			$('#planet1').css('background-position',p1 + 'px 0')
			$('#planet2').css('background-position',p2 + 'px 0')
		}
	}
	var planets = window.setInterval(movePlanet,12);
	var Niv=1;
	function time(){
		if (!gamePaused) {
			++timer;
			if(timer%5==0 && Niv<=3) {Niv++}
			$('#time').html((editTimer(parseInt(timer/60)) + ':' + editTimer(timer%60)));
		}
	}
var tm = window.setInterval(time,1000);
	function editTimer(val){
		var x = val + '';
		if (x.length < 2) return '0' + x;
		else return x;
	}

	function fuel_cp(){
		if (!gamePaused) {
			cp_fuel--;
			if (cp_fuel < 0) {
				cp_fuel = 0;
				gameOver();
			}
			$('#fuel').html(cp_fuel);
			$('#score').html(cp_score);
		}
	}
	var cf = window.setInterval(fuel_cp,1000);
     // clear timer
	 function clearTimer(){
		clearInterval(gf);
		clearInterval(tms);
		clearInterval(tmse);
		clearInterval(tmf);
		clearInterval(trc);
	 
	 }
	//Game Over
	function gameOver(){
		document.getElementById('bg-sound').pause()
		gamePaused = true;
		$('#gameboared').hide('fast');
		$('#gameover').show('slow');
clearTimer();
	}

	//Move UP
	var up = null;
	$('#up').mouseover(function(){
		up = window.setInterval(function(){
				var posTop = $('#airplane').position().top;
				posTop-=10;
				if (posTop < 0) posTop = 0;
				$('#airplane').css('top', posTop + 'px');
		},40)
	})
	$('#up').mouseleave(function(){
		clearInterval(up)
	})

	//Move DOWN
	var  down = null;
	$('#down').mouseover(function(){
		down = window.setInterval(function(){
			if (!gamePaused) {
				var posTop = $('#airplane').position().top;
				posTop+=10;
				if (posTop > 485) posTop = 485;
				$('#airplane').css('top', posTop + 'px');
			}
			
		},40)
	})
	$('#down').mouseleave(function(){
		clearInterval(down)
	})

	//Move LEFT
	var  left = null;
	$('#left').mouseover(function(){
		left = window.setInterval(function(){
			if (!gamePaused) {
				var posLeft = $('#airplane').position().left;
				posLeft-=10;
				if (posLeft < 0) posLeft = 0;
				$('#airplane').css('left', posLeft + 'px');
			}
			
		},40)
	})
	$('#left').mouseleave(function(){
		clearInterval(left)
	})

	//Move LEFT
	var  right = null;
	$('#right').mouseover(function(){
		right = window.setInterval(function(){
			if (!gamePaused) {
				var posLeft = $('#airplane').position().left;
				posLeft+=10;
				if (posLeft > 865) posLeft = 865;
				$('#airplane').css('left', posLeft + 'px');
			}
			
		},40)
	})
	$('#right').mouseleave(function(){
		clearInterval(right)
	})

	//Ship Enemy & friendly & aestroid1&
	var gse = null;
	var cp_obj = 0;
	var Tships = [];
	function generate(){
		gse = window.setInterval(function(){
			if (!gamePaused) {
				for(var i=1;i<=Niv;i++){
				
					var Tship=['ship1.png','ship2.png','ship3.png','friendly.png','aestroid1.png','aestroid2.png','aestroid3.png','aestroid4.png'];
					var indice = Math.floor(Math.random()*Tship.length);
					var selectedShip = Tship[indice];
					var typeobj=1;
					if(indice<3) {
						cp_obj++;
						Tships.push(cp_obj);
						type="ship";
					}
					else if(indice==3) { type="friendly"; typeobj=3;}
					else { type="aestroid";  typeobj=2;}
					var obj = $('<img class="ship" id="'+type+cp_obj+'" src="images/'+selectedShip+'" width="60px">');
					obj.css({top:Math.floor(Math.random()*600) % 550,right:0});
					listObj.push(type+cp_obj);
					move(obj , typeobj);
					obj.appendTo('#gameboared');
					randomShip();
					clearInterval(gse);
					generate();
				}				
			}

		},vitesse*Niv);
	}
		//move Enemy & friendly & aestroid
		var mvobj;
  	function move(ship  ,type){
		var cp = 0
		mvobj=window.setInterval(function(){
			if (!gamePaused) {
				cp++;
				ship.css('right',cp + 'px');
				if (cp>900) {
					var id_ship_remove = ship.attr('id').substr(4,1);
					deleteElement(id_ship_remove);
					ship.remove();
				}
			}
		},10)
		collusionEnemy(ship);
		collusionobj(ship,type);
	}
   //
   function collusionobj(obj, type){
		cs = window.setInterval(function(){
		var posobjsh=-1;
		for(var i=0;i<listShoot.length;i++) if(collusion($('#'+listShoot[i]),obj)) posobjsh=i;
			if ( posobjsh!=-1) {
		    	console.log( listShoot[posobjsh]);
				  $('#'+listShoot[posobjsh]).remove();
					if(type==1){
							obj.remove();
							cp_score+=5;
							ListCollAstroid.length=0;
					}
					else {
					if(type==2){
							 ListCollAstroid.push(obj.attr('id'));
							 if(getAstroid(obj.attr('id'))==1){
								ListCollAstroid.length=0;
								obj.remove();
								cp_score+=10;
								}
						     console.log(ListCollAstroid);
						}
						else{
						obj.remove();
							cp_score-=10;
							ListCollAstroid.length=0;
						
						}}
						console.log(ListCollAstroid.length);
			} 	
			
		},10)
	}
   
   //
	function getPosition(x){
		var pos = -1;
		for(var i = 0; i< Tships.length ; i++){
			if (Tships[i] == x) {
				pos = i;
			}
		}
		return pos;
	}

	function deleteElement(x){
		if (getPosition(x)!= -1) {
			for(var i = getPosition(x); i< Tships.length - 1 ; i++){
				Tships[i] = Tships[i+1];
			}
			Tships.pop();
		}
	}

	//Fuel
	var gf = null;
	function generateFuel(){
		gf = window.setInterval(function(){
			if (!gamePaused) {
				var obj = $('<img class="fuel" src="images/fuel.png" width="60px">');
				obj.css({top:0,right:(Math.floor(Math.random()*890))});
				moveFuel(obj);
				obj.appendTo('#gameboared');				
			}

		},Math.random()*3000 + 3000);
	}
    var tmf=null;
	function moveFuel(fuel){
		var cp = 0
		tmf=window.setInterval(function(){
			if (!gamePaused) {
				cp++;
				fuel.css('top',cp + 'px');
				if (cp>550) {
					fuel.remove();
				}
			}
		},10)
		collusionFuel(fuel)
	}

});
// $( window ).resize(function() {
//   location.reload();
// });
$('#instruction').center();
// $('#gameboared').center();
$('#ranking').center();  
$('#gameover').center();