document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const primeVideoPlayback = (video) => {
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const tryPlay = () => {
        const promise = video.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(() => {});
        }
    };

    video.addEventListener('loadedmetadata', tryPlay);
    video.addEventListener('canplay', tryPlay);
    tryPlay();
};

document.querySelectorAll('video').forEach((video) => {
    primeVideoPlayback(video);
});

['touchstart', 'click'].forEach((eventName) => {
    document.addEventListener(eventName, () => {
        document.querySelectorAll('video').forEach((video) => {
            primeVideoPlayback(video);
        });
    }, { passive: true });
});

const heroVideo = document.querySelector('.hero-media');
const muteToggle = document.querySelector('.mute-toggle');

if (heroVideo && muteToggle) {
    const updateToggle = (isMuted) => {
        muteToggle.textContent = isMuted ? '🔇' : '🔊';
        muteToggle.setAttribute('aria-pressed', String(isMuted));
        muteToggle.setAttribute('aria-label', isMuted ? '음소거 해제' : '음소거');
    };

    updateToggle(heroVideo.muted);

    muteToggle.addEventListener('click', () => {
        heroVideo.muted = !heroVideo.muted;
        updateToggle(heroVideo.muted);
    });
}

document.querySelectorAll('.feature-video video[data-start]').forEach((video) => {
    const startTime = Number(video.dataset.start);
    if (!Number.isFinite(startTime)) return;

    const seekToStart = () => {
        video.currentTime = startTime;
    };

    video.addEventListener('loadedmetadata', seekToStart);
    video.addEventListener('timeupdate', () => {
        if (video.currentTime < startTime) {
            video.currentTime = startTime;
        }
        if (video.duration && video.currentTime >= video.duration - 0.08) {
            video.currentTime = startTime;
        }
    });
});

document.querySelectorAll('.feature-video video').forEach((video) => {
    const container = video.closest('.feature-video');
    const showError = (message) => {
        if (!container) return;
        container.dataset.videoError = message;
        let label = container.querySelector('.video-error');
        if (!label) {
            label = document.createElement('span');
            label.className = 'video-error';
            container.appendChild(label);
        }
        label.textContent = message;
    };

    video.addEventListener('error', () => {
        const err = video.error;
        const code = err ? err.code : 'unknown';
        showError(`영상 로드 실패 (code: ${code})`);
    });
});
// ===== 가맹 상담 텔레그램 알림 (중복방지 버전) =====
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".inquiry-form");
    if (!form) return;
  
    let sending = false;
  
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      if (sending) return; // 이미 전송중이면 막기
      sending = true;
  
      const button = form.querySelector('button[type="submit"]');
      if (button) {
        button.disabled = true;
        button.innerText = "전송중...";
        button.style.opacity = "0.6";
      }
  
      const name = document.querySelector('input[name="name"]')?.value || "";
      const phone = document.querySelector('input[name="phone"]')?.value || "";
      const type = document.querySelector('input[name="type"]:checked')?.value || "";
      const region = document.querySelector('input[name="region"]')?.value || "";
      const time = document.querySelector('input[name="time"]')?.value || "";
  
      try {
        await fetch("https://script.google.com/macros/s/AKfycbxdx9-mdZuvCKa2OYbWYwrzuSppsR3YCZS2W5PaKLcP--q8AHIGSd3qkH13su2YDSQu/exec", {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ name, phone, type, region, time })
        });
  
        if (button) {
          button.innerText = "신청 완료 ✓";
          button.style.opacity = "1";
        }
  
        setTimeout(() => {
          alert("신청 완료!");
          form.reset();
          if (button) {
            button.disabled = false;
            button.innerText = "1:1 창업 상담 예약하기";
          }
          sending = false;
        }, 300);
  
      } catch (err) {
        alert("전송 실패. 다시 시도해주세요.");
        if (button) {
          button.disabled = false;
          button.innerText = "1:1 창업 상담 예약하기";
          button.style.opacity = "1";
        }
        sending = false;
      }
    });
  });