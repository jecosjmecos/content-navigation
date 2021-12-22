document.addEventListener("DOMContentLoaded", function() {
	
	// 1) Определяем область, в которой будем брать заголовоки. Вносим в переменную заголовки которые нам необходимы.
	const titles = document.querySelector('.post-content__content .text').querySelectorAll('h2,h3,h4');

	// 2) Добаввляем к нашим заголовкам id
	let i = 0;
	titles.forEach(title=>{
		title.setAttribute('id', `articles_title${i}`);
		i++;
	});

	// 3) Создаем объект и переменную, которые помогут нам сделать вложенность
	let titlesObj = {},
			h2;

	for(let i = 0; i < titles.length; i++){

		// 3.1) Если наш заголовок имеет класс no-active - мы его в содержимое навигации не добавляем
		if(titles[i].classList.contains('no-active')){
			continue;
		}

		if(titles[i].tagName == 'H2'){
			titlesObj[titles[i].textContent] = {
				'id': titles[i].getAttribute('id')
			};

			if(titles[i+1] && titles[i+1].tagName != 'H2'){
				h2 = titles[i].textContent;
				titlesObj[titles[i].textContent]['titles'] = {};
			}
		}

		if(titles[i].tagName != 'H2'){
			titlesObj[h2]['titles'][titles[i].textContent] = {
				'id': titles[i].getAttribute('id')
			}
		}
	}


	// 4) Создаем структуру нашего содержимого
	let navigation = '';

	for(let item in titlesObj){
		let subLinks = '';

		if(titlesObj[item]['titles']){
			subLinks = subLinks + '<ul>';

			for(let sub in titlesObj[item]['titles']){
				subLinks = subLinks + `<li><a href="#${titlesObj[item]['titles'][sub]['id']}">${sub}</a></li>`;
			}

			subLinks = subLinks + '</ul>';
		}

		navigation = navigation + `<li><a href="#${titlesObj[item]['id']}">${item}</a>${subLinks}</li>`;
	}	
	
	// 5) Добавляем разметку навигации в необходимую нам область
	document.querySelector('#articles_nav ul').innerHTML = navigation;


 	// 6) Создаем и вызываем функцию которая будет:
	// - плавно перемещать страницу в область с заголовком при клике на пункт навигации.
	// - будет подсвечивать нужный пункт меню при скролле страницы
	 	
	postContentNavigation();

	function postContentNavigation(){
			// 6.1) Заносим все ссылки навигации в переменную
			const smoothLinks = document.querySelectorAll('#articles_nav a');

			if(smoothLinks){

					// 6.2) Навешиваем на каждую ссылку событие клика
					for (let smoothLink of smoothLinks) {
							smoothLink.addEventListener('click', function (e) {
									e.preventDefault();
									const id = smoothLink.getAttribute('href');

									document.querySelector(id).scrollIntoView({
											behavior: 'smooth',
											block: 'start'
									});
							});
					};

					// 6.3) Подсвечиваем пункты меню 
					$(window).scroll(function(){
							var $sections = $('.post-content__content h2, .post-content__content h3, .post-content__content h4');
							$sections.each(function(i,el){
									var top  = $(el).offset().top-50;
									var bottom = top +$(el).height();
									var scroll = $(window).scrollTop();
									var id = $(el).attr('id');
									if( scroll > top && scroll < bottom){
											$('li.active').removeClass('active');
											$('a[href="#'+id+'"]').parents('li').addClass('active');

									}
							});
					});
			}
	}

});