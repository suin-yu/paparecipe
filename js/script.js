$(document).on('click', 'a[href="#"]', function(e){
    e.preventDefault();
});

// 라이브러리 초기화
$(function() {
    $('.animate').scrolla({ mobile: true, once: false });
    if (typeof Splitting === "function") Splitting(); 
});

$(function(){
    $('.menuOpen button').on('click', function(){ $('.menuOpen .menuWrap').addClass('on'); });
    $('.menuOpen .menuWrap .close').on('click',function(){ $('.menuOpen .menuWrap').removeClass('on'); });
});

document.addEventListener('DOMContentLoaded', function() {
    gsap.registerPlugin(ScrollTrigger);

    const header = document.querySelector('header');
    const visual = document.querySelector('.visual');
    const visualLogo = document.querySelector('.visual a.logo');
    const headerLogoContainer = document.querySelector('header .logo');
    
    if (!header || !visual || !visualLogo || !headerLogoContainer) return;

    // 1. 위치 계산
    const calcPos = () => {
        header.classList.add('fixed-state');
        headerLogoContainer.style.opacity = '1';
        const rect = headerLogoContainer.getBoundingClientRect();
        header.classList.remove('fixed-state');
        headerLogoContainer.style.opacity = '0';
        
        return {
            initX: window.innerWidth / 2,
            initY: window.innerHeight / 2,
            initW: visualLogo.offsetWidth,
            targetX: rect.left + (rect.width / 2),
            targetY: rect.top + (rect.height / 2),
            targetW: rect.width
        };
    };

    let pos = calcPos();
    window.addEventListener('resize', () => { pos = calcPos(); });

    // 2. [애니메이션 구간] 로고가 작아지는 트리거 (1000px 동안 실행)
    const visualTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: visual,
            start: "top top",
            end: "+=1000",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onLeave: () => {
                // 애니메이션 구간이 끝나면 헤더 고정 상태 활성화
                header.classList.add('fixed-state');
                gsap.set(visualLogo, { opacity: 0 });
                headerLogoContainer.style.opacity = '1';
            },
            onEnterBack: () => {
                // 다시 위로 올라오면 고정 해제
                header.classList.remove('fixed-state');
                gsap.set(visualLogo, { opacity: 1 });
                headerLogoContainer.style.opacity = '0';
            },
            onUpdate: (self) => {
                const prog = self.progress;
                if (prog < 1) {
                    const curW = pos.initW + (pos.targetW - pos.initW) * prog;
                    const curX = (pos.initX + (pos.targetX - pos.initX) * prog) - (curW / 2);
                    const curY = (pos.initY + (pos.targetY - pos.initY) * prog) - (visualLogo.offsetHeight / 2);

                    gsap.set(visualLogo, {
                        position: 'fixed',
                        opacity: 1,
                        width: curW,
                        left: curX,
                        top: curY,
                        transform: 'none',
                        zIndex: 9999,
                        pointerEvents: 'none'
                    });
                }
            }
        }
    });

    // 3. [일반 구간] 수정본
const headerAnim = gsap.to(header, {
    yPercent: -100,
    duration: 0.3,
    paused: true,
    ease: "power2.out"
});

ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
        const currentScroll = self.scroll();

        if (currentScroll > 1050) {
            header.classList.add('fixed-state');

            if (self.direction === 1) {
                headerAnim.play();
            } else {
                // 올릴 때 나타남
                headerAnim.reverse();
                
                // [추가] 나타날 때 헤더를 강제로 화면 맨 위로 호출
                gsap.set(header, { 
                    zIndex: 9999999, 
                    display: 'flex', 
                    opacity: 1 
                });
            }
        } else {
            header.classList.remove('fixed-state');
            headerAnim.reverse();
        }
    }
});

    // --- Visual Gradient & Bottom Image ---
    gsap.timeline({
        scrollTrigger: { trigger: ".visual", start: "top top", end: "+=1000", scrub: true }
    })
    .to(".visual .grad", { y: -500, ease: "none" }, 0)
    .fromTo(".visual .img-bottom", { y: 100, opacity: 0 }, { y: 0, opacity: 1, ease: "power2.out" }, 0.2);

    // --- Intro 텍스트 애니메이션 ---
    function splitText(sel) {
        const el = document.querySelector(sel);
        if(!el) return;
        const nodes = Array.from(el.childNodes);
        el.innerHTML = ""; 
        nodes.forEach(n => {
            if (n.nodeType === 3) { 
                [...n.textContent].forEach(c => { const s = document.createElement("span"); s.innerText = c === " " ? "\u00A0" : c; el.appendChild(s); });
            } else if (n.nodeType === 1) {
                const w = document.createElement("span"); w.className = n.className;
                [...n.textContent].forEach(c => { const s = document.createElement("span"); s.innerText = c === " " ? "\u00A0" : c; w.appendChild(s); });
                el.appendChild(w);
            }
        });
    }
    splitText(".tit"); splitText(".txt");
    gsap.to(".tit span", { opacity: 1, color: "#fff", stagger: 0.05, scrollTrigger: { trigger: ".intro", start: "top 60%", end: "top 20%", scrub: 1 } });
    gsap.to(".txt span", { opacity: 1, color: "#eaeaea", stagger: 0.02, scrollTrigger: { trigger: ".intro", start: "top 40%", end: "top 0%", scrub: 1 } });

    

// --- Product 스크롤 수정본 ---
ScrollTrigger.normalizeScroll(true); 
ScrollTrigger.config({ ignoreMobileResize: true });

// --- Product 스크롤 타이틀/이미지 동기화 수정본 ---
const productSec = document.querySelector('.scroll-item');

if (productSec) {
    const items = gsap.utils.toArray('.product-list li');
    const titles = gsap.utils.toArray('.product-title');
    const mainImgs = gsap.utils.toArray('.img-wrap img');

    // 초기 상태 설정
    gsap.set(titles, { opacity: 0 }); 
    gsap.set(titles[0], { opacity: 1 });
    gsap.set(mainImgs, { opacity: 0 }); 
    gsap.set(mainImgs[0], { opacity: 1 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: productSec,
            start: "top top",
            end: window.innerWidth <= 768 ? "+=3000" : "+=10000", 
            pin: true,
            scrub: 1.5,     
            invalidateOnRefresh: true,
            onEnter: () => {
                if(window.innerWidth > 768) gsap.to('body', { backgroundColor: '#1A1A1E', duration: 0.5 });
            },
            onLeaveBack: () => {
                if(window.innerWidth > 768) gsap.to('body', { backgroundColor: '#fff', duration: 0.5 });
            }
        }
    });

    items.forEach((item, i) => {
        gsap.set(item, { xPercent: -50, yPercent: -50, top: "50%", left: "50%", position: "absolute" });

        /**
         * 핵심 로직 수정:
         * aI (메인 이미지): 오른쪽 리스트 2개당 1장 변경 -> i / 2
         * aT (h2 타이틀): 오른쪽 리스트 4개당 1번 변경 -> i / 4
         */
        let aI = Math.floor(i / 2); 
        let aT = Math.floor(i / 4); 

        tl.fromTo(item, 
            { autoAlpha: 0, y: window.innerWidth <= 768 ? 150 : 500, scale: 0.8 },
            { 
                autoAlpha: 1, y: 0, duration: 2, scale: 1.1, ease: "none",
                onStart: () => {
                    // 스크롤 내릴 때 업데이트
                    updateMedia(aT, aI);
                },
                onReverseComplete: () => {
                    // 스크롤 올릴 때 이전 상태로 복구
                    if (i > 0) {
                        let prevAI = Math.floor((i - 1) / 2);
                        let prevAT = Math.floor((i - 1) / 4);
                        updateMedia(prevAT, prevAI);
                    }
                }
            }, 
            i === 0 ? 0 : ">-1.5" 
        )
        .to(item, { duration: 1 }, ">") 
        .to(item, { 
            autoAlpha: 0, 
            y: window.innerWidth <= 768 ? -150 : -500, 
            scale: 0.8, 
            duration: 1.5, 
            ease: "none" 
        }, ">-0.5");
    });

    // 미디어 교체 함수
    function updateMedia(titleIdx, imgIdx) {
        // h2 타이틀 교체
        titles.forEach((t, idx) => {
            gsap.to(t, { 
                opacity: idx === titleIdx ? 1 : 0, 
                display: idx === titleIdx ? "block" : "none", // 필요시 공간 확보를 위해 추가
                duration: 0.4, 
                overwrite: true 
            });
        });
        // 메인 이미지 교체
        mainImgs.forEach((m, idx) => {
            gsap.to(m, { 
                opacity: idx === imgIdx ? 1 : 0, 
                duration: 0.4, 
                overwrite: true 
            });
        });
    }
}


    // --- Skin Concern: 텍스트 단어별 등장 + 이미지 애니메이션 ---

const splitWordsForSkin = (selector) => {
    const targets = document.querySelectorAll(selector);
    targets.forEach(target => {
        const text = target.innerText;
        target.innerHTML = '';
        

        text.split(' ').forEach(word => {
            const span = document.createElement('span');
            span.classList.add('word');
            span.innerText = word;
            target.appendChild(span);

            target.appendChild(document.createTextNode(' '));
        });
    });
};

// 분리 실행 (span.label과 h3를 대상으로 함)
splitWordsForSkin('.skin-concern .left .label, .skin-concern .left h3');

// 단어들이 한 줄씩/한 단어씩 서서히 보이는 애니메이션
gsap.utils.toArray('.skin-concern .left').forEach((container) => {
    const words = container.querySelectorAll('.word');
    
    gsap.to(words, {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
            trigger: container,
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });
});

// --- Skin Concern: 이미지 차오르는 등장 + 둥둥 애니메이션  ---
gsap.utils.toArray('.skin-concern .imgAni').forEach((box, i) => {
    gsap.fromTo(box, 
        { 
            clipPath: "inset(100% 0 0 0)",   
            webkitClipPath: "inset(100% 0 0 0)",
            y: 50                               
        }, 
        { 
            clipPath: "inset(0% 0 0 0)",      
            webkitClipPath: "inset(0% 0 0 0)",
            y: 0,
            duration: 1,
            ease: "power2.inOut",            
            scrollTrigger: {
                trigger: box,
                start: "top 90%",          
                toggleActions: "restart none none reverse"
            }
        }
    );
    // 무한 둥둥 애니메이션
    gsap.to(box, {
        y: i % 2 === 0 ? -20 : 20,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.8 
    });
});

    // --- Day6 & Model & Theraphy ---
    ['.day6 .imgAni', '.model .imgAni'].forEach(sel => {
        gsap.utils.toArray(sel).forEach(c => {
            const img = c.querySelector('img');
            if (img) gsap.to(img, { yPercent: -20, scrub: 1, scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: 1 } });
        });
    });

    const marqueeList = document.querySelector('.marquee-content');
    if (marqueeList) {
        marqueeList.innerHTML += marqueeList.innerHTML;
        gsap.to(marqueeList, { x: -(marqueeList.offsetWidth/2), duration: 30, ease: "none", repeat: -1 });
        gsap.utils.toArray('.theraphy .imgAni2').forEach((box, i) => {
            gsap.to(box, { y: i % 2 === 0 ? -30 : 30, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
        });
        gsap.utils.toArray('.theraphy .imgAni2 img').forEach(img => {
            gsap.set(img, { filter: 'brightness(60%)' });
            img.addEventListener('mouseenter', () => gsap.to(img, { filter: 'brightness(100%)', duration: 0.5 }));
            img.addEventListener('mouseleave', () => gsap.to(img, { filter: 'brightness(60%)', duration: 0.5 }));
        });
    }

// --- 배경색 & 커서 ---

let mm = gsap.matchMedia();

mm.add("(min-width: 769px)", () => {
    const bgMap = [
        { t: ".day6", c: "#F0E5E0" }, 
        { t: ".model", c: "#F0E5E0" }, 
        { t: ".skin-concern", c: "#1A1A1E" }
    ];

    bgMap.forEach((m, index) => {
        const target = document.querySelector(m.t);
        if(target) {
            ScrollTrigger.create({ 
                trigger: target, 
                start: "top 50%", 
                end: "bottom 50%", // 끝나는 지점 설정
                onEnter: () => gsap.to('body', { backgroundColor: m.c, duration: 0.8 }), 
                onEnterBack: () => gsap.to('body', { backgroundColor: m.c, duration: 0.8 }),
                // 스크롤을 완전히 올려서 첫 번째 섹션 이전으로 갈 때 초기화하고 싶다면 추가
                onLeaveBack: () => {
                    if(index === 0) gsap.to('body', { backgroundColor: "", duration: 0.8 });
                }
            });
        }
    });

    return () => gsap.set('body', { backgroundColor: "" });
});

const cursorImg = document.querySelector('.cursor-texture');
if (cursorImg) {
    window.addEventListener('mousemove', (e) => gsap.to(cursorImg, { x: e.clientX-50, y: e.clientY-50, duration: 0.5 }));
    document.querySelector('.skin-concern')?.addEventListener('mouseenter', () => gsap.to(cursorImg, { autoAlpha: 0.8, scale: 1 }));
    document.querySelector('.skin-concern')?.addEventListener('mouseleave', () => gsap.to(cursorImg, { autoAlpha: 0, scale: 0.5 }));
}

// footer
const footerH3 = document.querySelector('footer .top h3');
const footerTop = document.querySelector('footer .top');

if (footerH3) {
    // 1. 초기 상태 설정
    gsap.set(footerH3, { 
        webkitClipPath: "inset(0 100% 0 0)", 
        clipPath: "inset(0 100% 0 0)" 
    });

    gsap.to(footerH3, {
        clipPath: "inset(0 0% 0 0)",
        webkitClipPath: "inset(0 0% 0 0)",
        duration: 1.2,
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: "footer",
            start: "top 80%", // 뷰포트 80% 지점에 푸터 상단이 보일 때 시작
            end: "bottom top", // 푸터가 완전히 화면을 벗어날 때까지 유지
            toggleActions: "play reverse play reverse", // 내릴 때 재생, 올릴 때 역재생
            onEnter: () => {
                if (footerTop) footerTop.style.backgroundColor = '#F0E5E0';
            },
            onLeaveBack: () => {
                // 다시 위로 올릴 때 배경색을 원래대로 돌리고 싶다면 추가
                if (footerTop) footerTop.style.backgroundColor = ''; 
            }
        }
    });
}

gsap.utils.toArray('.animate').forEach((el) => {
    ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        onEnter: () => {
            const animationClass = el.getAttribute('data-animate'); 
            el.classList.add(animationClass);
        },
        onLeaveBack: () => el.classList.remove(el.getAttribute('data-animate'))
    });
});

    ScrollTrigger.refresh();
});

