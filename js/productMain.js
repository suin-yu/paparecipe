//00.a속성제거(a를 클릭했을 때 위로 튕기는 현상 제거)
$(document).on('click', 'a[href="#"]', function(e) {e.preventDefault();})


// 모바일 메뉴 open/close
$(function () {
  $('.menuOpen button').on('click', function () {
    $('.menuOpen .menuWrap').addClass('on');
  });

  $('.menuOpen .menuWrap .close').on('click', function (e) {
    e.preventDefault();
    $('.menuOpen .menuWrap').removeClass('on');
  });
});

// 헤더 고정 + 스크롤 다운 시 숨김 / 업 시 표시
document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('header');
  if (!header) return;

  let lastY = window.scrollY;
  const threshold = 10;        // 이 값 이상 스크롤하면 fixed-state 적용
  const tolerance = 5;         // 너무 민감하게 흔들리지 않게

  function onScroll() {
    const y = window.scrollY;

    // 일정 이상 스크롤하면 헤더 고정 상태
    if (y > threshold) header.classList.add('fixed-state');
    else header.classList.remove('fixed-state');

    // 아래로 스크롤하면 숨김, 위로 스크롤하면 표시
    if (y > lastY + tolerance) {
      header.classList.add('header-hidden');
    } else if (y < lastY - tolerance) {
      header.classList.remove('header-hidden');
    }

    lastY = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // 최초 실행
});




$(function () {

  function changeTurnImage() {
    var winW = $(window).width();

    if (winW < 768) {
        $('.visual .inner>.img img').attr('src', 'img/productMain/visualMain_768.png');
        $('.allProduct .inner .list_product .turn .text img')
            .attr('src', 'img/productMain/allProduct_turn_text2.svg');
        $('.top h2').html('Embracing beauty<br>that begins in nature');
        $('.top p').html('자연에서 시작된 아름다움이 시간과 일상 속에서<br>천천히 스며들어 나를 더욱 빛나게 합니다.');
    } else {
        $('.allProduct .inner .list_product .turn .text img')
            .attr('src', 'img/productMain/allProduct_turn_text.svg');
        $('.top h2').html('Embracing beauty that begins in nature');
        $('.top p').html('자연에서 시작된 아름다움이<br>시간과 일상 속에서 천천히 스며들어 나를 더욱 빛나게 합니다.');
    }
    if (winW < 390 ) {
      $('.visual .inner>.img img').attr('src', 'img/productMain/visualMain_390.png');
    }
  }
  




  // 최초 실행
  changeTurnImage();

  // 리사이즈 시 다시 체크
  $(window).on('resize', changeTurnImage);

});
