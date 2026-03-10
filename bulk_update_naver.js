/**
 * 🔧 네이버플레이스 링크 & 이미지 일괄 업데이트 스크립트
 *
 * 사용법:
 * 1. 관리자 페이지(admin_dz_map11.html) 열기
 * 2. F12 → Console 탭 열기
 * 3. 아래 shops 배열에 각 업체의 link, imageUrl 채우기
 * 4. 이 파일 내용 전체를 콘솔에 붙여넣기 → Enter
 *
 * 네이버 플레이스 링크 복사 방법:
 * - 네이버 지도 앱 → 가게 검색 → "공유" → 링크 복사
 * - 또는 PC: map.naver.com → 가게 검색 → URL 복사
 *
 * 네이버 플레이스 이미지 링크 복사 방법:
 * - 네이버 플레이스 페이지 → 대표 사진 우클릭 → "이미지 주소 복사"
 */

(async () => {
    const { db, updateDoc, doc } = window._fb;

    const shops = [
        {
            id: "jGNfmMMYkMvD6M3bml76",
            name: "동그라미쿠키 본점",
            link: "",      // ← 여기에 네이버 플레이스 링크 붙여넣기
            imageUrl: ""   // ← 여기에 이미지 링크 붙여넣기
        },
        {
            id: "K2G4d5y8X9Q0hcihiDCT",
            name: "동그라미쿠키 복현점",
            link: "",
            imageUrl: ""
        },
        {
            id: "DhgvqsfZorF19skh67s0",
            name: "동그라미쿠키 신월성점",
            link: "",
            imageUrl: ""
        },
        {
            id: "E9o2l7U4NCfGXCqS00ut",
            name: "아르토",
            link: "",
            imageUrl: ""
        },
        // 바닐라크럼브는 이미 link/imageUrl 있음 — 스킵
        {
            id: "hw5vvkkc5vXrzs6EnAbW",
            name: "이지쿠키클럽",
            link: "",
            imageUrl: ""
        },
        {
            id: "j1j2F3nkpm7pv15AU0IG",
            name: "일하",
            link: "",
            imageUrl: ""
        },
        {
            id: "qeqCSpuOpi0DABWMU1ZE",
            name: "디베이크샵",
            link: "",
            imageUrl: ""
        },
        {
            id: "JOQXqLqCmB6r665gdgwq",
            name: "디플리",
            link: "",
            imageUrl: ""
        },
        {
            id: "8Fsc6ITkgWuq6rNNc1I8",
            name: "라이프 앤 커피",
            link: "",
            imageUrl: ""
        },
        {
            id: "briAnWb7Va14CCsLDHRf",
            name: "단디과자점",
            link: "",
            imageUrl: ""
        },
        {
            id: "7wMvJRSXK3cFKrm8dvq9",
            name: "더기커피",
            link: "",
            imageUrl: ""
        }
    ];

    let success = 0, fail = 0, skip = 0;

    for (const shop of shops) {
        if (!shop.link && !shop.imageUrl) {
            console.log(`⏭️ ${shop.name} — link/imageUrl 모두 비어있어 스킵`);
            skip++;
            continue;
        }

        const updateData = {};
        if (shop.link) updateData.link = shop.link;
        if (shop.imageUrl) updateData.imageUrl = shop.imageUrl;

        try {
            await updateDoc(doc(db, "shops", shop.id), updateData);
            console.log(`✅ ${shop.name} 업데이트 완료`);
            success++;
        } catch (e) {
            console.error(`❌ ${shop.name} 실패:`, e.message);
            fail++;
        }
    }

    console.log(`\n📊 결과: ✅ ${success}개 성공, ❌ ${fail}개 실패, ⏭️ ${skip}개 스킵`);
})();
