import { Round4Package } from '../types/round4';

export const defaultRound4Packages: Round4Package[] = [
  // ==================== PACKAGE 1: QUANTUM ACCELERATOR & HIGGS FLUX ====================
  {
    id: 'pkg-01',
    packageNumber: 1,
    title: 'Gia Tốc Hạt Lượng Tử & Dòng Hạt Higgs',
    codeName: 'QUANTUM-FUSION-99',
    theme: 'Vật Lí Hạt Nhân & Mô Hình Hóa AI',
    description: 'Điều tra dao động bất thường trong máy gia tốc hạt PeK Hadron Collider khi phát hiện dòng phân rã boson.',
    aiScan: {
      title: 'Quét Phổ Phân Rã Hạt Hạ Nguyên Tử',
      core: 'physics',
      prompt: 'Cảm biến lượng tử ghi nhận 4 xung bức xạ hạt trong buồng va chạm. Hãy quét và phát hiện đỉnh năng lượng tương ứng với phân rã Boson Higgs (125 GeV).',
      systemTelemetry: 'Tần số máy gia tốc: 40 MHz | Cường độ từ trường siêu dẫn: 8.3 Tesla | Nhiệt độ cryo: 1.9 K',
      scanTargets: [
        { id: 'scan-1', label: 'Cụm Tín hiệu Alpha', value: '45 GeV', isAnomaly: false, frequency: '3.2 GHz', description: 'Nhiễu nền tán xạ muon thông thường' },
        { id: 'scan-2', label: 'Cụm Tín hiệu Beta', value: '91 GeV', isAnomaly: false, frequency: '5.6 GHz', description: 'Đỉnh cộng hưởng của hạt Z-Boson' },
        { id: 'scan-3', label: 'Cụm Tín hiệu Gamma-Higgs', value: '125 GeV', isAnomaly: true, frequency: '8.8 GHz', wavelength: '0.0098 pm', description: 'Đỉnh cộng hưởng hai photon phân rã hạt Higgs!' },
        { id: 'scan-4', label: 'Cụm Tín hiệu Delta', value: '173 GeV', isAnomaly: false, frequency: '11.2 GHz', description: 'Khối lượng nghỉ của Top Quark đơn lẻ' }
      ],
      correctTargetId: 'scan-3',
      explanation: 'Hạt Higgs có khối lượng xấp xỉ 125 GeV/c² và phân rã thành cặp 2 photon gamma năng lượng cao trong buồng dò.',
      visualGraphic: 'particle_collision'
    },
    aiErrorDetector: {
      title: 'Phát Hiện Sai Sót Mô Phỏng Động Lực Học',
      core: 'physics',
      simulationTopic: 'Định luật Bảo toàn Năng lượng và Xung lượng trong Va chạm đàn hồi',
      aiSimulationText: 'AI Lab Simulator báo cáo: "Trong va chạm trực diện giữa hai proton vận tốc 0.99c, tổng động năng sau va chạm tăng thêm 15% do chuyển hóa thế năng chân không thành năng lượng cơ học mà không cần nguồn cấp bổ sung."',
      bugDescription: 'Mô phỏng của AI đã vi phạm một nguyên lý nền tảng của vật lí học.',
      options: [
        { id: 'opt-1', text: 'AI tính sai vận tốc tương đối tính của hai proton theo phép cộng vận tốc Lorentz.', isFlaw: false },
        { id: 'opt-2', text: 'Vi phạm Định luật I Nhiệt động lực học & Định luật Bảo toàn Năng lượng: Động năng không thể tự sinh thêm từ hư không.', isFlaw: true },
        { id: 'opt-3', text: 'Va chạm hạt không thể tạo ra bức xạ điện từ trong chân không.', isFlaw: false },
        { id: 'opt-4', text: 'Proton là hạt cơ bản không có cấu trúc quark nên không thể tương tác đàn hồi.', isFlaw: false }
      ],
      correctOptionId: 'opt-2',
      patchExplanation: 'Năng lượng toàn phần của hệ kín luôn được bảo toàn; tổng năng lượng sau va chạm phải bằng tổng năng lượng trước va chạm theo hệ thức Einstein E² = (pc)² + (m₀c²)².'
    },
    scienceCrossover: {
      title: 'Giao Thoa Quang Lượng Tử & Cảm Biến Sinh Học',
      coresInvolved: ['physics', 'biology'],
      scenario: 'Để phát hiện các phân tử virus kích thước nanomet trong dịch cơ thể, phòng lab kết hợp hiện tượng cộng hưởng Plasmon bề mặt (SPR) với kháng thể sinh học.',
      scientificDilemma: 'Khi virus bám vào kháng thể gắn trên màng vàng mỏng, đại lượng vật lí nào của sóng điện từ bề mặt bị biến đổi giúp cảm biến nhận biết?',
      options: [
        { id: 'opt-1', text: 'Điện trở suất của màng vàng tăng lên gấp 10 lần do virus phóng điện.', reasoning: 'Sai bản chất quang học' },
        { id: 'opt-2', text: 'Chiết suất cục bộ tại bề mặt thay đổi, làm dịch chuyển góc cộng hưởng của chùm laser phản xạ.', reasoning: 'Hiện tượng quang sinh học chính xác' },
        { id: 'opt-3', text: 'Ánh sáng bị phân cực tròn biến đổi thành sóng âm thanh tần số siêu âm.', reasoning: 'Sai định luật' },
        { id: 'opt-4', text: 'Khối lượng virus kích hoạt phản ứng phân hạch hạt nhân trên màng kim loại.', reasoning: 'Vô lý' }
      ],
      correctOptionId: 'opt-2',
      explanation: 'Cảm biến SPR phát hiện sự thay đổi chiết suất quang học (Refractive Index) cực nhỏ khi kháng nguyên bám đặc hiệu vào kháng thể trên bề mặt kim loại quý.'
    },
    aiDataLab: {
      title: 'Phân Tích Đồ Thị Động Học Bán Rã Hạt',
      core: 'physics',
      datasetName: 'Độ phóng xạ của đồng vị hạt nhân theo thời gian',
      chartType: 'decay',
      dataPoints: [
        { x: '0h', y: 1000, label: 'N₀' },
        { x: '3h', y: 500, label: 'N₀/2' },
        { x: '6h', y: 250, label: 'N₀/4' },
        { x: '9h', y: 125, label: 'N₀/8' },
        { x: '12h', y: 62.5, label: 'N₀/16' }
      ],
      question: 'Dựa vào bảng dữ liệu suy giảm phóng xạ thực nghiệm, chu kỳ bán rã (T) của mẫu chất là bao nhiêu giờ và sau 15 giờ số hạt còn lại là bao nhiêu?',
      inputUnit: 'giờ & hạt',
      options: [
        { id: 'opt-1', text: 'T = 3 giờ; sau 15 giờ còn lại 31.25 hạt (N₀/32)' },
        { id: 'opt-2', text: 'T = 6 giờ; sau 15 giờ còn lại 62.5 hạt' },
        { id: 'opt-3', text: 'T = 1.5 giờ; sau 15 giờ mẫu phân rã hoàn toàn' },
        { id: 'opt-4', text: 'T = 4.5 giờ; sau 15 giờ còn lại 125 hạt' }
      ],
      correctOptionId: 'opt-1',
      numericalTarget: 3,
      numericalTolerance: 0.1,
      explanation: 'Sau mỗi 3 giờ, độ phóng xạ giảm một nửa (1000 -> 500 -> 250). Do đó chu kỳ bán rã T = 3 giờ. Sau 15h = 5T, N = 1000 / 2⁵ = 31.25 hạt.'
    },
    keywordPuzzle: {
      type: 'sort',
      title: 'Ma Trận Trật Tự Năng Lượng Lượng Tử',
      instruction: 'Sắp xếp 4 khái niệm khoa học sau đây theo trật tự mức năng lượng tăng dần của thang sóng điện từ để mở khóa lõi.',
      keysUsed: ['KHOA HỌC', 'SÁNG TẠO', 'CHINH PHỤC'],
      sortItems: [
        { id: 'item-1', text: 'Sóng Radio & Vi Ba (Microwave)', correctOrder: 1 },
        { id: 'item-2', text: 'Quang Phổ Ánh Sáng Nhìn Thấy', correctOrder: 2 },
        { id: 'item-3', text: 'Tia Rơn-ghen (X-Ray Y Tế)', correctOrder: 3 },
        { id: 'item-4', text: 'Tia Gamma Phân Rã Lượng Tử', correctOrder: 4 }
      ],
      finalKeyword: 'NEXT GEN',
      explanation: 'Thang sóng điện từ: Năng lượng photon E = h.f = h.c/λ tỉ lệ thuận với tần số, tăng dần từ Radio -> Khả kiến -> Tia X -> Tia Gamma.'
    },
    finalCode: {
      code: 'QUANTUM-FUSION-99',
      hint: 'Mã lõi hạt nhân năng lượng: QUANTUM-FUSION-99',
      systemChecksum: '0x88A9C1'
    },
    active: true
  },

  // ==================== PACKAGE 2: CRISPR NANO-EDITING & GENE THERAPY ====================
  {
    id: 'pkg-02',
    packageNumber: 2,
    title: 'Biên Tập Gen CRISPR & Cắt Dán Phân Tử Cas9',
    codeName: 'CRISPR-NEXUS-88',
    theme: 'Sinh Học Phân Tử & Công Nghệ Sinh Học',
    description: 'Chỉ huy hệ thống AI dẫn đường enzyme Cas9 nhận diện và sửa đổi đoạn mã ADN đột biến gây bệnh.',
    aiScan: {
      title: 'Quét Trình Tự Nucleotide và Đoạn Trùng Lặp PAM',
      core: 'biology',
      prompt: 'Hệ thống sgRNA đang quét mạch đôi ADN. Hãy xác định vị trí chuỗi nhận diện PAM (NGG) để enzyme Cas9 tiến hành cắt mạch chính xác.',
      systemTelemetry: 'Nhiệt độ lai hóa: 37.0°C | Nồng độ Mg²⁺: 5.0 mM | Độ dài sgRNA: 20 nt',
      scanTargets: [
        { id: 'scan-1', label: 'Vùng Exon A-1', value: '5-ATCGATCG-3', isAnomaly: false, frequency: '12.4 kb', description: 'Trình tự không có motif PAM' },
        { id: 'scan-2', label: 'Đoạn Mã Nhận Diện PAM', value: '5-TGG-3', isAnomaly: true, frequency: '24.8 kb', wavelength: '3.4 nm', description: 'Trình tự PAM chuẩn NGG cho Cas9 liên kết!' },
        { id: 'scan-3', label: 'Vùng Intron B-2', value: '5-AAAAAA-3', isAnomaly: false, frequency: '18.1 kb', description: 'Đoạn poly-A không mã hóa' },
        { id: 'scan-4', label: 'Vùng Promoter TATA', value: '5-TATAAA-3', isAnomaly: false, frequency: '8.9 kb', description: 'Vị trí bám của ARN Polymerase' }
      ],
      correctTargetId: 'scan-2',
      explanation: 'Enzyme Cas9 từ vi khuẩn Streptococcus pyogenes yêu cầu trình tự PAM có dạng 5-NGG-3 ngay sau vùng tương đồng 20 nucleotide để tạo vết cắt đôi mạch dsDNA.',
      visualGraphic: 'dna_helix'
    },
    aiErrorDetector: {
      title: 'Phát Hiện Sai Sót Nguyên Tắc Bổ Sung Trong Tái Bản',
      core: 'biology',
      simulationTopic: 'Cơ chế Tái bản ADN và Bổ sung Bazơ Nitơ',
      aiSimulationText: 'AI Sinh học dự đoán: "Trong quá trình tổng hợp mạch mới, ADN Polymerase gắn Adenin liên kết với Guanin bằng 3 liên kết hydro, và Thymine gắn với Cytosine bằng 2 liên kết hydro."',
      bugDescription: 'Nguyên tắc bổ sung giữa các nucleotit trong mô phỏng AI đã bị sai lệch nghiêm trọng.',
      options: [
        { id: 'opt-1', text: 'Sai nguyên tắc bổ sung: Đúng phải là A liên kết với T (2 liên kết H), G liên kết với C (3 liên kết H).', isFlaw: true },
        { id: 'opt-2', text: 'ADN Polymerase chỉ hoạt động ở nhiệt độ 100°C nên mô phỏng không thực tế.', isFlaw: false },
        { id: 'opt-3', text: 'Mạch ADN không bao giờ có liên kết hydro mà chỉ có liên kết photphodieste.', isFlaw: false },
        { id: 'opt-4', text: 'Adenin không thể xuất hiện trong tế bào nhân thực.', isFlaw: false }
      ],
      correctOptionId: 'opt-1',
      patchExplanation: 'Theo mô hình Watson - Crick, A luôn liên kết với T bằng 2 liên kết hydro; G luôn liên kết với C bằng 3 liên kết hydro.'
    },
    scienceCrossover: {
      title: 'Điện Di Gel ADN & Lực Điện Trường Coulomb',
      coresInvolved: ['biology', 'physics'],
      scenario: 'Để phân tách các đoạn ADN sau khi cắt bằng Cas9, các nhà khoa học sử dụng kỹ thuật điện di trên thạch agarose tích điện trong dung dịch đệm TAE.',
      scientificDilemma: 'Vì sao các đoạn ADN luôn di chuyển từ cực âm sang cực dương của buồng điện di và đoạn nào di chuyển nhanh nhất?',
      options: [
        { id: 'opt-1', text: 'ADN tích điện âm do nhóm phosphat (PO₄³⁻); đoạn kích thước ngắn nhất sẽ di chuyển nhanh nhất qua các lỗ thạch.', reasoning: 'Vật lí - Sinh học chính xác' },
        { id: 'opt-2', text: 'ADN tích điện dương do đường deoxyribose; đoạn dài nhất bay nhanh nhất.', reasoning: 'Sai bản chất điện tích' },
        { id: 'opt-3', text: 'ADN di chuyển do lực từ trường Lorentz xoay tròn đoạn gen.', reasoning: 'Sai cơ chế' },
        { id: 'opt-4', text: 'Không phụ thuộc điện tích mà do lực đẩy tĩnh điện của nước.', reasoning: 'Sai' }
      ],
      correctOptionId: 'opt-1',
      explanation: 'Khung xương photphat của ADN mang điện tích âm đều đặn, do đó dưới tác dụng của lực điện trường F = q.E, ADN bị hút về cực dương (+). Đoạn ngắn ít bị cản trở bởi ma trận gel nên chạy xa nhất.'
    },
    aiDataLab: {
      title: 'Phân Tích Động Học Sinh Trưởng Vi Khuẩn Tái Tổ Hợp',
      core: 'biology',
      datasetName: 'Độ hấp thụ quang học OD600 biểu thị mật độ vi khuẩn E.coli',
      chartType: 'kinetics',
      dataPoints: [
        { x: '0h', y: 0.05, label: 'Tiềm phát' },
        { x: '2h', y: 0.20, label: 'Lũy thừa' },
        { x: '4h', y: 0.80, label: 'Lũy thừa đỉnh' },
        { x: '6h', y: 1.60, label: 'Cân bằng' },
        { x: '8h', y: 1.62, label: 'Cân bằng' }
      ],
      question: 'Thời gian thế hệ (g) của quần thể vi khuẩn trong pha lũy thừa từ 2h đến 4h (khi OD tăng từ 0.20 lên 0.80, gấp 4 lần = 2 thế hệ) là bao nhiêu phút?',
      inputUnit: 'phút',
      options: [
        { id: 'opt-1', text: 'g = 60 phút / thế hệ' },
        { id: 'opt-2', text: 'g = 20 phút / thế hệ' },
        { id: 'opt-3', text: 'g = 120 phút / thế hệ' },
        { id: 'opt-4', text: 'g = 30 phút / thế hệ' }
      ],
      correctOptionId: 'opt-1',
      numericalTarget: 60,
      numericalTolerance: 1,
      explanation: 'Trong khoảng thời gian t = 2 giờ (120 phút), số tế bào tăng gấp 4 = 2² (trải qua n = 2 thế hệ). Thời gian thế hệ g = t / n = 120 phút / 2 = 60 phút.'
    },
    keywordPuzzle: {
      type: 'science_connection',
      title: 'Mạng Lưới Khái Niệm Sinh Học Tiến Hóa',
      instruction: 'Nối chính xác các cấp độ cấu trúc sinh học với chức năng di truyền tương ứng.',
      keysUsed: ['KHOA HỌC', 'SÁNG TẠO', 'CHINH PHỤC'],
      connectionPairs: [
        { id: 'pair-1', left: 'ADN (Axít Deoxyribonucleic)', right: 'Lưu giữ & truyền đạt thông tin di truyền', category: 'Genetics' },
        { id: 'pair-2', left: 'ARN Thông Tin (mRNA)', right: 'Khuôn mẫu trực tiếp cho dịch mã protein', category: 'Translation' },
        { id: 'pair-3', left: 'Ribosome', right: 'Nhà máy tổng hợp chuỗi polypeptide', category: 'Organelle' },
        { id: 'pair-4', left: 'Enzyme Cas9', right: 'Kéo sinh học cắt đứt mạch đôi DNA mục tiêu', category: 'Biotech' }
      ],
      finalKeyword: 'NEXT GEN',
      explanation: 'Trục truyền đạt thông tin di truyền trung tâm (Central Dogma): DNA -> Phiên mã tạo mRNA -> Dịch mã tại Ribosome tạo Protein.'
    },
    finalCode: {
      code: 'CRISPR-NEXUS-88',
      hint: 'Mật mã kỹ thuật gen tương lai: CRISPR-NEXUS-88',
      systemChecksum: '0x99B4D2'
    },
    active: true
  },

  // ==================== PACKAGE 3: CATALYTIC FUEL CELL & GREEN HYDROGEN ====================
  {
    id: 'pkg-03',
    packageNumber: 3,
    title: 'Pin Nhiên Liệu Hydro & Điện Hóa Xúc Tác Xanh',
    codeName: 'HYDRO-CELL-77',
    theme: 'Hóa Học Năng Lượng & Điện Hóa Học',
    description: 'Tối ưu hóa phản ứng oxy hóa khử trong pin nhiên liệu màng trao đổi proton PEMFC cung cấp năng lượng sạch.',
    aiScan: {
      title: 'Quét Điện Thế Cực và Thế Điện Hóa Chuẩn',
      core: 'chemistry',
      prompt: 'Hệ thống đang quét thế điện cực chuẩn của các bán phản ứng tại Anode và Cathode. Hãy chọn cặp bán phản ứng tạo ra suất điện động chuẩn dương lớn nhất cho pin nhiên liệu hydro-oxy.',
      systemTelemetry: 'Màng Nafion dẫn proton | Nhiệt độ làm việc: 80°C | Áp suất H₂: 2.5 bar',
      scanTargets: [
        { id: 'scan-1', label: 'Cặp O₂/H₂O (+1.23V) & 2H⁺/H₂ (0.00V)', value: 'E° = +1.23 V', isAnomaly: true, frequency: '1.23 V', wavelength: 'PEMFC', description: 'Phản ứng pin chuẩn tạo ra nước và điện năng sạch!' },
        { id: 'scan-2', label: 'Cặp Cu²⁺/Cu & Zn²⁺/Zn', value: 'E° = +1.10 V', isAnomaly: false, frequency: '1.10 V', description: 'Pin galvanic cổ điển Daniell' },
        { id: 'scan-3', label: 'Cặp Fe³⁺/Fe²⁺ & Ag⁺/Ag', value: 'E° = +0.03 V', isAnomaly: false, frequency: '0.03 V', description: 'Hiệu điện thế quá nhỏ' },
        { id: 'scan-4', label: 'Cặp Na⁺/Na & Cl₂/2Cl⁻', value: 'E° = -4.07 V', isAnomaly: false, frequency: '-4.07 V', description: 'Phản ứng không tự xảy ra' }
      ],
      correctTargetId: 'scan-1',
      explanation: 'Trong pin nhiên liệu Hydro-Oxy: Tại Anot xảy ra quá trình oxy hóa 2H₂ -> 4H⁺ + 4e (0.00V), tại Catot xảy ra khử O₂ + 4H⁺ + 4e -> 2H₂O (+1.23V). Suất điện động chuẩn E°pin = E°catot - E°anot = 1.23 V.',
      visualGraphic: 'chemical_bonds'
    },
    aiErrorDetector: {
      title: 'Phát Hiện Sai Sót Trong Cân Bằng Oxy Hóa Khử',
      core: 'chemistry',
      simulationTopic: 'Phương Pháp Thăng Bằng Electron Trong Hóa Học',
      aiSimulationText: 'AI Hóa học đề xuất phương trình: "KMnO₄ + FeSO₄ + H₂SO₄ -> Fe₂(SO₄)₃ + MnSO₄ + K₂SO₄ + H₂O với tỉ lệ mol KMnO₄ : FeSO₄ là 1 : 1."',
      bugDescription: 'Tỉ lệ mol electron trao đổi trong phản ứng oxy hóa khử của AI bị sai lệch.',
      options: [
        { id: 'opt-1', text: 'Sai tỉ lệ electron: Mn⁺⁷ nhận 5e trong khi Fe⁺² chỉ nhường 1e, do đó tỉ lệ mol đúng phải là 1 KMnO₄ : 5 FeSO₄ (hoặc 2:10).', isFlaw: true },
        { id: 'opt-2', text: 'Axit H₂SO₄ là chất khử chứ không phải môi trường axit.', isFlaw: false },
        { id: 'opt-3', text: 'KMnO₄ không thể tác dụng với muối sắt trong môi trường axit.', isFlaw: false },
        { id: 'opt-4', text: 'Sắt từ +2 bị khử xuống sắt 0.', isFlaw: false }
      ],
      correctOptionId: 'opt-1',
      patchExplanation: 'Quá trình oxy hóa: Fe⁺² -> Fe⁺³ + 1e (nhân 5); Quá trình khử: Mn⁺⁷ + 5e -> Mn⁺² (nhân 1). Phương trình cân bằng: 2KMnO₄ + 10FeSO₄ + 8H₂SO₄ -> 5Fe₂(SO₄)₃ + 2MnSO₄ + K₂SO₄ + 8H₂O.'
    },
    scienceCrossover: {
      title: 'Định Luật Faraday & Năng Lượng Điện Phân Nước',
      coresInvolved: ['chemistry', 'physics'],
      scenario: 'Để sản xuất Hydro xanh, hệ thống điện phân nước bằng dòng điện I = 10A chạy liên tục trong 9650 giây qua bình điện phân KOH loãng.',
      scientificDilemma: 'Khối lượng khí Hydro (M = 2 g/mol) thu được tại catot theo định luật Faraday là bao nhiêu gram?',
      options: [
        { id: 'opt-1', text: 'm = 1.00 gam H₂ (tương đương 0.5 mol H₂)', reasoning: 'Áp dụng công thức m = (A.I.t) / (n.F)' },
        { id: 'opt-2', text: 'm = 2.00 gam H₂', reasoning: 'Quên chia cho số e trao đổi n=2' },
        { id: 'opt-3', text: 'm = 10.0 gam H₂', reasoning: 'Tính sai hằng số F' },
        { id: 'opt-4', text: 'm = 0.10 gam H₂', reasoning: 'Sai thứ nguyên' }
      ],
      correctOptionId: 'opt-1',
      explanation: 'Theo định luật Faraday: m = (A.I.t)/(n.F) = (2 * 10 * 9650) / (2 * 96500) = 1.0 gam H₂.'
    },
    aiDataLab: {
      title: 'Xác Định Bậc Phản Ứng & Hằng Số Tốc Độ Phản Ứng',
      core: 'chemistry',
      datasetName: 'Tốc độ ban đầu v theo nồng độ chất phản ứng [A]',
      chartType: 'kinetics',
      dataPoints: [
        { x: 'Thí nghiệm 1 ([A]=0.1M)', y: 0.02, label: 'v₁' },
        { x: 'Thí nghiệm 2 ([A]=0.2M)', y: 0.08, label: 'v₂' },
        { x: 'Thí nghiệm 3 ([A]=0.3M)', y: 0.18, label: 'v₃' }
      ],
      question: 'Khi nồng độ [A] tăng gấp đôi (0.1 lên 0.2), tốc độ phản ứng v tăng gấp 4 lần (0.02 lên 0.08). Phản ứng này có bậc mấy theo chất A?',
      inputUnit: 'bậc',
      options: [
        { id: 'opt-1', text: 'Bậc 2 (v = k.[A]²)' },
        { id: 'opt-2', text: 'Bậc 1 (v = k.[A])' },
        { id: 'opt-3', text: 'Bậc 0 (tốc độ không đổi)' },
        { id: 'opt-4', text: 'Bậc 3' }
      ],
      correctOptionId: 'opt-1',
      numericalTarget: 2,
      numericalTolerance: 0.1,
      explanation: 'Tỉ số v₂ / v₁ = (0.2 / 0.1)ⁿ = 2ⁿ = 4 => n = 2. Phản ứng có bậc động học là bậc 2.'
    },
    keywordPuzzle: {
      type: 'word_matrix',
      title: 'Ma Trận Từ Khóa Liên Kết Hóa Học',
      instruction: 'Giải mã bản chất tương tác giữa các nguyên tử trong phân tử nước và mạng lưới pin hydro.',
      keysUsed: ['KHOA HỌC', 'SÁNG TẠO', 'CHINH PHỤC'],
      connectionPairs: [
        { id: 'p-1', left: 'Liên kết Cộng hóa trị Phân cực', right: 'Liên kết giữa H và O trong phân tử H₂O', category: 'Chemical' },
        { id: 'p-2', left: 'Liên kết Hydro Liên phân tử', right: 'Giải thích nhiệt độ sôi cao dị thường của nước', category: 'Intermolecular' },
        { id: 'p-3', left: 'Chất Xúc tác Bạch kim (Pt)', right: 'Giảm năng lượng hoạt hóa phản ứng phân tách H₂', category: 'Catalyst' },
        { id: 'p-4', left: 'Màng PEM', right: 'Chỉ cho proton H⁺ đi qua, ngăn cản electron', category: 'Membrane' }
      ],
      finalKeyword: 'NEXT GEN',
      explanation: 'Pin nhiên liệu hydro vận hành nhờ sự kết hợp giữa xúc tác nano bạch kim, màng polymer chọn lọc proton và liên kết điện hóa oxy hóa khử.'
    },
    finalCode: {
      code: 'HYDRO-CELL-77',
      hint: 'Mật mã năng lượng xanh PeK: HYDRO-CELL-77',
      systemChecksum: '0x77E1A5'
    },
    active: true
  },

  // ==================== PACKAGE 4: NEURAL SYNAPSE & BRAIN-COMPUTER INTERFACE ====================
  {
    id: 'pkg-04',
    packageNumber: 4,
    title: 'Khớp Thần Kinh Synapse & Giao Diện Não - Máy BCI',
    codeName: 'SYNAPSE-AI-66',
    theme: 'Thần Kinh Học & Trí Tuệ Nhân Tạo',
    description: 'Giải mã tín hiệu điện thế hoạt động của nơ-ron thần kinh và huấn luyện mạng nơ-ron sâu giải mã ý nghĩ chuyển động.',
    aiScan: {
      title: 'Quét Điện Thế Màng Nơ-ron Thần Kinh',
      core: 'biology',
      prompt: 'Điện cực nano ghi nhận sự biến thiên điện thế màng sợi trục. Hãy quét đỉnh khử cực tương ứng với pha đảo cực của điện thế hoạt động (+30 mV).',
      systemTelemetry: 'Kênh ion Na⁺/K⁺ nhạy điện thế | Nồng độ Na⁺ ngoại bào: 145 mM | Nồng độ K⁺ nội bào: 150 mM',
      scanTargets: [
        { id: 'scan-1', label: 'Điện Thế Nghỉ Ban Đầu', value: '-70 mV', isAnomaly: false, frequency: 'Bơm Na-K', description: 'Trạng thái phân cực nghỉ của màng' },
        { id: 'scan-2', label: 'Ngưỡng Kích Hoạt Điện Thế', value: '-55 mV', isAnomaly: false, frequency: 'Ngưỡng hưng phấn', description: 'Ngưỡng mở kênh natri cảm ứng điện' },
        { id: 'scan-3', label: 'Đỉnh Điện Thế Hoạt Động (Đảo cực)', value: '+30 mV', isAnomaly: true, frequency: 'Dòng Na⁺ ồ ạt', wavelength: '1 ms', description: 'Đỉnh đảo cực điện thế kích hoạt xung thần kinh!' },
        { id: 'scan-4', label: 'Pha Tái Cực Quá Mức', value: '-90 mV', isAnomaly: false, frequency: 'Kênh K⁺ mở chậm', description: 'Thời kỳ trơ tương đối' }
      ],
      correctTargetId: 'scan-3',
      explanation: 'Khi kích thích đạt ngưỡng (-55 mV), kênh Na⁺ mở ồ ạt đưa Na⁺ vào trong làm điện thế màng tăng vọt từ âm sang dương (+30 mV), tạo ra xung điện thế hoạt động lan truyền dọc sợi trục.',
      visualGraphic: 'neural_circuit'
    },
    aiErrorDetector: {
      title: 'Phát Hiện Sai Sót Trong Cấu Trúc Khớp Thần Kinh Synapse Hóa Học',
      core: 'biology',
      simulationTopic: 'Cơ Chế Dẫn Truyền Xung Qua Khớp Thần Kinh Synapse',
      aiSimulationText: 'AI Simulator mô tả: "Chất trung gian hóa học (Acetylcholine) được phóng thích từ màng sau synapse, khuếch tán ngược vào khe synapse rồi đi vào chùy synapse ở màng trước để kích hoạt xung."',
      bugDescription: 'Chiều dẫn truyền thông tin qua synapse hóa học của AI bị đảo ngược hoàn toàn.',
      options: [
        { id: 'opt-1', text: 'Sai chiều dẫn truyền: Túi chứa chất trung gian hóa học ở chùy màng trước, giải phóng qua khe và gắn vào thụ thể đặc hiệu ở màng sau (dẫn truyền 1 chiều).', isFlaw: true },
        { id: 'opt-2', text: 'Acetylcholine không phải chất trung gian thần kinh.', isFlaw: false },
        { id: 'opt-3', text: 'Khe synapse không có dịch ngoại bào mà là chân không tuyệt đối.', isFlaw: false },
        { id: 'opt-4', text: 'Điện thế hoạt động không cần ion Canxi (Ca²⁺) để hòa màng túi.', isFlaw: false }
      ],
      correctOptionId: 'opt-1',
      patchExplanation: 'Synapse hóa học chỉ dẫn truyền xung điện theo một chiều duy nhất: từ màng trước qua khe synapse đến màng sau vì chỉ màng trước có bóng chứa chất trung gian và chỉ màng sau có thụ thể tiếp nhận.'
    },
    scienceCrossover: {
      title: 'Mô Hình Mạng Nơ-ron Nhân Tạo & Hàm Kích Hoạt Sinh Học',
      coresInvolved: ['ai_tech', 'biology'],
      scenario: 'Các kỹ sư mô phỏng nơ-ron sinh học bằng một nơ-ron nhân tạo (Perceptron) với các trọng số w₁, w₂ và độ lệch b, dùng hàm kích hoạt Sigmoid σ(z) = 1 / (1 + e⁻ᶻ).',
      scientificDilemma: 'Nếu tổng đầu vào z = w₁x₁ + w₂x₂ + b = 0, giá trị đầu ra σ(z) của nơ-ron nhân tạo là bao nhiêu?',
      options: [
        { id: 'opt-1', text: 'σ(0) = 0.50 (ngưỡng phân định nhị phân xác suất 50%)', reasoning: 'Toán học AI chính xác' },
        { id: 'opt-2', text: 'σ(0) = 0.00', reasoning: 'Sai' },
        { id: 'opt-3', text: 'σ(0) = 1.00', reasoning: 'Sai' },
        { id: 'opt-4', text: 'σ(0) = vô cực', reasoning: 'Sai' }
      ],
      correctOptionId: 'opt-1',
      explanation: 'Khi z = 0, e⁰ = 1 => σ(0) = 1 / (1 + 1) = 0.50. Đây là điểm uốn trung gian của hàm kích hoạt sigmoid mô phỏng ngưỡng hưng phấn nơ-ron.'
    },
    aiDataLab: {
      title: 'Phân Tích Độ Suy Giảm Hàm Mất Mát (Loss Function) Của Mô Hình AI',
      core: 'ai_tech',
      datasetName: 'Giá trị hàm mất mát Cross-Entropy qua các Epoch huấn luyện',
      chartType: 'neural_loss',
      dataPoints: [
        { x: 'Epoch 1', y: 1.85, label: 'Bắt đầu' },
        { x: 'Epoch 10', y: 0.92, label: 'Học nhanh' },
        { x: 'Epoch 20', y: 0.35, label: 'Hội tụ' },
        { x: 'Epoch 30', y: 0.12, label: 'Tối ưu' },
        { x: 'Epoch 40', y: 0.11, label: 'Bão hòa' }
      ],
      question: 'Từ Epoch 1 đến Epoch 30, giá trị hàm mất mát Loss giảm từ 1.85 xuống 0.12. Độ chính xác nhận dạng sóng não BCI được cải thiện do thuật toán nào tối ưu hóa trọng số?',
      inputUnit: 'thuật toán',
      options: [
        { id: 'opt-1', text: 'Thuật toán Lan truyền ngược (Backpropagation) kết hợp Hạ Gradient (Adam/SGD)' },
        { id: 'opt-2', text: 'Thuật toán Sắp xếp nổi bọt (Bubble Sort)' },
        { id: 'opt-3', text: 'Tìm kiếm nhị phân ngẫu nhiên không tính đạo hàm' },
        { id: 'opt-4', text: 'Mã hóa bù hai' }
      ],
      correctOptionId: 'opt-1',
      explanation: 'Mạng nơ-ron tối ưu hóa trọng số bằng cách tính đạo hàm riêng của hàm mất mát theo từng trọng số (Gradient Descent) và lan truyền ngược sai số từ lớp ra về lớp vào.'
    },
    keywordPuzzle: {
      type: 'science_connection',
      title: 'Mạng Lưới Khái Niệm Thần Kinh & Trí Tuệ Nhân Tạo',
      instruction: 'Nối chính xác các cấu trúc sinh học thần kinh với thành phần tương ứng trong kiến trúc mạng nơ-ron AI.',
      keysUsed: ['KHOA HỌC', 'SÁNG TẠO', 'CHINH PHỤC'],
      connectionPairs: [
        { id: 'syn-1', left: 'Nơ-ron Sinh học (Neuron)', right: 'Perceptron / Node mạng nơ-ron nhân tạo', category: 'NeuroAI' },
        { id: 'syn-2', left: 'Khớp Thần kinh (Synapse)', right: 'Trọng số kết nối (Weight w)', category: 'NeuroAI' },
        { id: 'syn-3', left: 'Ngưỡng Kích hoạt Màng (-55mV)', right: 'Độ lệch Bias (b) & Hàm kích hoạt Activation', category: 'NeuroAI' },
        { id: 'syn-4', left: 'Chất Dẫn truyền Thần kinh', right: 'Tín hiệu truyền dữ liệu xuôi giữa các lớp nơ-ron', category: 'NeuroAI' }
      ],
      finalKeyword: 'NEXT GEN',
      explanation: 'Kiến trúc Deep Learning được truyền cảm hứng trực tiếp từ mạng nơ-ron sinh học của não bộ con người.'
    },
    finalCode: {
      code: 'SYNAPSE-AI-66',
      hint: 'Mật mã đồng bộ nơ-ron não bộ: SYNAPSE-AI-66',
      systemChecksum: '0x66F4C9'
    },
    active: true
  },

  // ==================== PACKAGE 5: TOKAMAK FUSION CORE & PLASMA ====================
  {
    id: 'pkg-05',
    packageNumber: 5,
    title: 'Lò Phản Ứng Nhiệt Hạch Tokamak & Plasma Bẫy Từ',
    codeName: 'TOKAMAK-STAR-55',
    theme: 'Vật Lí Nhiệt Hạch & Năng Lượng Mặt Trời Nhân Tạo',
    description: 'Khống chế plasma nhiệt độ 100 triệu độ C bằng bẫy từ trường xoắn ốc để duy trì phản ứng tổng hợp hạt nhân D-T.',
    aiScan: {
      title: 'Quét Tiêu Chuẩn Lawson Trong Bẫy Plasma',
      core: 'physics',
      prompt: 'Hệ thống bẫy từ đang đo mật độ hạt n, nhiệt độ T và thời gian giam giữ năng lượng τ. Hãy tìm điểm đạt tiêu chuẩn Lawson n.T.τ để phản ứng nhiệt hạch tự duy trì bốc cháy.',
      systemTelemetry: 'Áp suất plasma: 5 atm | Dòng điện plasma: 15 MA | Nhiệt độ lõi: 120,000,000 K',
      scanTargets: [
        { id: 'scan-1', label: 'Vùng Nhiệt độ 10 triệu K', value: 'Chưa đủ ngưỡng', isAnomaly: false, frequency: '0.1 keV', description: 'Chưa vượt qua hàng rào thế Coulomb' },
        { id: 'scan-2', label: 'Vùng Đạt Tiêu Chuẩn Lawson', value: 'n.T.τ ≥ 3×10²¹ m⁻³keVs', isAnomaly: true, frequency: '15 keV', wavelength: '0.01 nm', description: 'Điểm bốc cháy nhiệt hạch tự duy trì (Ignition Point)!' },
        { id: 'scan-3', label: 'Vùng Rò Rỉ Từ Trường', value: 'Mất giam giữ', isAnomaly: false, frequency: 'Nhiễu loạn', description: 'Bất ổn định MHD méo bề mặt' },
        { id: 'scan-4', label: 'Vùng Phản Xạ Thành Lò', value: 'Tấm Berili', isAnomaly: false, frequency: '300 K', description: 'Vỏ chịu nhiệt làm nguội' }
      ],
      correctTargetId: 'scan-2',
      explanation: 'Tiêu chuẩn Lawson quy định tích số giữa mật độ plasma, nhiệt độ ion và thời gian giam giữ năng lượng phải vượt qua ngưỡng tới hạn để công suất nhiệt hạch lớn hơn tổn hao bức xạ.',
      visualGraphic: 'tokamak_reactor'
    },
    aiErrorDetector: {
      title: 'Phát Hiện Sai Sót Trong Phương Trình Phản Ứng Nhiệt Hạch',
      core: 'physics',
      simulationTopic: 'Phản ứng Nhiệt hạch Deuterium - Tritium (D-T)',
      aiSimulationText: 'AI Simulator đưa ra phương trình: "₁²H + ₁³H -> ₂⁴He + ₁¹p + 17.6 MeV; hạt tạo thành gồm hạt Heli và một hạt Proton."',
      bugDescription: 'Định luật bảo toàn số khối A và điện tích Z trong phản ứng hạt nhân bị AI vi phạm.',
      options: [
        { id: 'opt-1', text: 'Sai hạt phát ra: Tổng số nuclon vế trái là 2+3=5, vế phải hạt He có 4 nên hạt còn lại phải là Nơtron (₀¹n), không thể là Proton (₁¹p).', isFlaw: true },
        { id: 'opt-2', text: 'Nhiệt hạch là phản ứng thu năng lượng chứ không tỏa năng lượng.', isFlaw: false },
        { id: 'opt-3', text: 'Deuterium và Tritium là đồng vị của Carbon chứ không phải Hydro.', isFlaw: false },
        { id: 'opt-4', text: 'Hạt Heli tạo thành có số khối bằng 3.', isFlaw: false }
      ],
      correctOptionId: 'opt-1',
      patchExplanation: 'Phương trình đúng: ₁²H + ₁³H -> ₂⁴He (3.5 MeV) + ₀¹n (14.1 MeV) + 17.6 MeV. Hạt phát ra mang phần lớn động năng là hạt nơtron trung hòa.'
    },
    scienceCrossover: {
      title: 'Vật Liệu Hấp Thụ Nơtron & Phân Rã Hóa Học Liti',
      coresInvolved: ['physics', 'chemistry'],
      scenario: 'Để tái tạo nhiên liệu Triti quý hiếm, lò Tokamak bao bọc bởi một lớp phủ gốm chứa Liti (Li). Nơtron năng lượng cao từ phản ứng D-T bắn phá hạt nhân ₃⁶Li.',
      scientificDilemma: 'Sản phẩm phản ứng hạt nhân giữa ₀¹n và ₃⁶Li tạo ra hạt nào giúp tái tạo nhiên liệu Triti?',
      options: [
        { id: 'opt-1', text: 'Tạo ra Triti (₁³H) và hạt Alpha (₂⁴He): ₀¹n + ₃⁶Li -> ₁³H + ₂⁴He + 4.8 MeV', reasoning: 'Hóa học hạt nhân chính xác' },
        { id: 'opt-2', text: 'Tạo ra khí Clo và khí Hydro', reasoning: 'Vô lý' },
        { id: 'opt-3', text: 'Tạo ra Uranium-235', reasoning: 'Sai' },
        { id: 'opt-4', text: 'Chuyển hóa hoàn toàn thành sóng điện từ', reasoning: 'Sai' }
      ],
      correctOptionId: 'opt-1',
      explanation: 'Lớp chắn Liti hấp thụ nơtron để sinh ra đồng vị Triti (₁³H), sau đó chiết tách hóa học quay trở lại buồng đốt nhiệt hạch tạo chu trình khép kín.'
    },
    aiDataLab: {
      title: 'Tính Toán Độ Hụt Khối & Năng Lượng Tỏa Ra Của Phản Ứng',
      core: 'physics',
      datasetName: 'Khối lượng nghỉ chính xác của các hạt trong phản ứng D-T',
      chartType: 'spectrum',
      dataPoints: [
        { x: 'm(D)', y: 2.0141, label: 'amu' },
        { x: 'm(T)', y: 3.0160, label: 'amu' },
        { x: 'm(He)', y: 4.0015, label: 'amu' },
        { x: 'm(n)', y: 1.0087, label: 'amu' }
      ],
      question: 'Tính độ hụt khối Δm = (m_D + m_T) - (m_He + m_n) theo đơn vị u (amu) và khẳng định phản ứng tỏa hay thu năng lượng?',
      inputUnit: 'u',
      options: [
        { id: 'opt-1', text: 'Δm = 0.0199 u > 0; Phản ứng tỏa năng lượng cực lớn (~18.5 MeV)' },
        { id: 'opt-2', text: 'Δm = -0.0199 u; Phản ứng thu nhiệt' },
        { id: 'opt-3', text: 'Δm = 0.0000 u; Năng lượng không thay đổi' },
        { id: 'opt-4', text: 'Δm = 1.0087 u' }
      ],
      correctOptionId: 'opt-1',
      numericalTarget: 0.0199,
      numericalTolerance: 0.001,
      explanation: 'Tổng khối lượng trước m_truoc = 2.0141 + 3.0160 = 5.0301 u. Tổng khối lượng sau m_sau = 4.0015 + 1.0087 = 5.0102 u. Độ hụt khối Δm = 0.0199 u > 0 => Phản ứng tỏa năng lượng E = Δm.c² ≈ 18.5 MeV.'
    },
    keywordPuzzle: {
      type: 'sort',
      title: 'Trình Tự Vận Hành Đánh Lửa Nhiệt Hạch Tokamak',
      instruction: 'Sắp xếp 4 giai đoạn khởi động lò phản ứng hạt nhân theo đúng quy trình vật lí.',
      keysUsed: ['KHOA HỌC', 'SÁNG TẠO', 'CHINH PHỤC'],
      sortItems: [
        { id: 's-1', text: 'Bơm hút chân không siêu cao & kích hoạt nam châm siêu dẫn 8T', correctOrder: 1 },
        { id: 's-2', text: 'Phun khí nhiên liệu Deuterium - Tritium vào buồng chứa hình xuyến', correctOrder: 2 },
        { id: 's-3', text: 'Gia nhiệt bằng sóng vi ba cao tần Ion Cyclotron lên 100 triệu °C', correctOrder: 3 },
        { id: 's-4', text: 'Duy trì bốc cháy nhiệt hạch ổn định & thu hồi nhiệt lượng sinh hơi', correctOrder: 4 }
      ],
      finalKeyword: 'NEXT GEN',
      explanation: 'Quy trình vận hành Tokamak: Hút chân không -> Nạp khí -> Gia nhiệt Ion hóa thành Plasma -> Giam giữ từ trường & Thu hồi nhiệt.'
    },
    finalCode: {
      code: 'TOKAMAK-STAR-55',
      hint: 'Mật mã năng lượng mặt trời nhân tạo: TOKAMAK-STAR-55',
      systemChecksum: '0x55C8F1'
    },
    active: true
  },

  // ==================== PACKAGE 6: MOLECULAR SPECTROSCOPY & ORGANIC SYNTHESIS ====================
  {
    id: 'pkg-06',
    packageNumber: 6,
    title: 'Quang Phổ Hồng Ngoại FTIR & Tổng Hợp Hữu Cơ',
    codeName: 'FTIR-SYNTH-44',
    theme: 'Hóa Học Hữu Cơ & Cấu Trúc Phân Tử',
    description: 'Giải mã phổ hồng ngoại (IR) và phổ cộng hưởng từ hạt nhân (NMR) để xác định cấu trúc phân tử dược chất kháng virus.',
    aiScan: {
      title: 'Quét Số Sóng Hấp Thụ Đặc Trưng Của Nhóm Chức',
      core: 'chemistry',
      prompt: 'Hệ thống quang phổ FTIR ghi nhận pic hấp thụ mạnh tại vùng số sóng 1715 cm⁻¹. Hãy xác định liên kết hóa học đặc trưng tương ứng.',
      systemTelemetry: 'Độ phân giải: 1 cm⁻¹ | Nguồn sáng: Đèn Nernst hồng ngoại | Buồng đo mẫu: Tinh thể kim cương ATR',
      scanTargets: [
        { id: 'scan-1', label: 'Pic Vân Nhóm Hydroxyl O-H (liên kết H)', value: '3300 cm⁻¹', isAnomaly: false, frequency: 'Dải tù rộng', description: 'Đặc trưng cho nhóm rượu ancol/axit' },
        { id: 'scan-2', label: 'Pic Nhóm Carbonyl C=O (Este/Xeton)', value: '1715 cm⁻¹', isAnomaly: true, frequency: 'Pic nhọn sâu', wavelength: '5.83 µm', description: 'Dao động hóa trị kéo dãn của nhóm C=O mạnh nhất!' },
        { id: 'scan-3', label: 'Pic Liên kết C-H No', value: '2950 cm⁻¹', isAnomaly: false, frequency: 'Vùng vân ngón tay', description: 'Gốc hidrocacbon ankyl' },
        { id: 'scan-4', label: 'Pic Liên kết Ba C≡C', value: '2200 cm⁻¹', isAnomaly: false, frequency: 'Cường độ yếu', description: 'Ankin mạch hở' }
      ],
      correctTargetId: 'scan-2',
      explanation: 'Dải hấp thụ mạnh và sắc nhọn tại vùng 1700 - 1750 cm⁻¹ trên phổ hồng ngoại là tín hiệu đặc trưng kinh điển của dao động kéo dãn liên kết đôi C=O (nhóm carbonyl trong xeton, andehit hoặc este).',
      visualGraphic: 'chemical_bonds'
    },
    aiErrorDetector: {
      title: 'Phát Hiện Sai Sót Đồng Phân Hình Học Cis - Trans',
      core: 'chemistry',
      simulationTopic: 'Điều Kiện Xuất Hiện Đồng Phân Hình Học Trong Hóa Hữu Cơ',
      aiSimulationText: 'AI Hóa học kết luận: "Hợp chất propilen (CH₂=CH-CH₃) có hai đồng phân hình học cis và trans do liên kết đôi C=C không thể quay tự do."',
      bugDescription: 'AI đã bỏ qua điều kiện cần và đủ về các nhóm thế ở hai đầu liên kết đôi.',
      options: [
        { id: 'opt-1', text: 'Sai điều kiện: Nguyên tử C đầu mạch gắn với 2 nguyên tử H giống nhau (CH₂=) nên không thể có đồng phân hình học cis - trans.', isFlaw: true },
        { id: 'opt-2', text: 'Liên kết đôi C=C có thể tự do quay tròn ở nhiệt độ phòng.', isFlaw: false },
        { id: 'opt-3', text: 'Chỉ có ankan mạch vòng mới có đồng phân hình học.', isFlaw: false },
        { id: 'opt-4', text: 'Propilen là hợp chất vô cơ.', isFlaw: false }
      ],
      correctOptionId: 'opt-1',
      patchExplanation: 'Điều kiện để phân tử có đồng phân hình học: Phải có liên kết đôi (hoặc vòng no) và ở mỗi nguyên tử C mang liên kết đôi, hai nhóm thế gắn vào nó phải khác nhau đôi một (R₁ ≠ R₂ và R₃ ≠ R₄).'
    },
    scienceCrossover: {
      title: 'Cơ Chế Phản Ứng Este Hóa & Cân Bằng Hóa Học Le Chatelier',
      coresInvolved: ['chemistry', 'physics'],
      scenario: 'Để nâng cao hiệu suất tổng hợp este thơm (CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O, phản ứng thuận nghịch tỏa nhiệt nhẹ), các nhà hóa học ứng dụng nguyên lý chuyển dịch cân bằng.',
      scientificDilemma: 'Biện pháp nào sau đây giúp chuyển dịch cân bằng theo chiều thuận tạo ra nhiều este nhất?',
      options: [
        { id: 'opt-1', text: 'Dùng H₂SO₄ đặc làm xúc tác hút nước và chưng cất liên tục tách este ra khỏi hỗn hợp phản ứng.', reasoning: 'Chính xác theo nguyên lý Le Chatelier' },
        { id: 'opt-2', text: 'Tăng lượng nước vào hỗn hợp phản ứng.', reasoning: 'Chuyển dịch nghịch' },
        { id: 'opt-3', text: 'Tăng áp suất buồng phản ứng lên 100 atm.', reasoning: 'Số mol khí hai vế bằng nhau không đổi' },
        { id: 'opt-4', text: 'Giảm lượng axit axetic dư.', reasoning: 'Giảm nồng độ chất phản ứng làm giảm chiều thuận' }
      ],
      correctOptionId: 'opt-1',
      explanation: 'Theo nguyên lý Le Chatelier, lấy bớt sản phẩm este hoặc nước (bằng H₂SO₄ đặc hút nước và chưng cất este) sẽ thúc đẩy cân bằng chuyển dịch theo chiều thuận tạo thêm sản phẩm.'
    },
    aiDataLab: {
      title: 'Đường Cong Chuẩn Độ Axit - Bazơ & Xác Định Điểm Tương Đương',
      core: 'chemistry',
      datasetName: 'Giá trị pH dung dịch khi nhỏ từng ml NaOH 0.1M vào 25ml HCl 0.1M',
      chartType: 'titration',
      dataPoints: [
        { x: '0 ml', y: 1.0, label: 'Ban đầu' },
        { x: '10 ml', y: 1.4, label: 'Trước TĐ' },
        { x: '24.9 ml', y: 3.7, label: 'Gần TĐ' },
        { x: '25.0 ml', y: 7.0, label: 'Điểm Tương đương' },
        { x: '25.1 ml', y: 10.3, label: 'Bước nhảy pH' },
        { x: '30 ml', y: 11.9, label: 'Dư bazơ' }
      ],
      question: 'Tại điểm tương đương (V_NaOH = 25.0 ml), pH của dung dịch bằng 7.0. Khi nhỏ dư 0.1ml (đạt 25.1ml), pH tăng vọt từ 3.7 lên 10.3 được gọi là hiện tượng gì?',
      inputUnit: 'hiện tượng',
      options: [
        { id: 'opt-1', text: 'Bước nhảy pH (pH jump) tại vùng lân cận điểm tương đương' },
        { id: 'opt-2', text: 'Hiện tượng kết tủa muối' },
        { id: 'opt-3', text: 'Hiện tượng bốc hơi dung môi' },
        { id: 'opt-4', text: 'Sự đảo ngược điện cực' }
      ],
      correctOptionId: 'opt-1',
      numericalTarget: 7,
      numericalTolerance: 0.1,
      explanation: 'Khi chuẩn độ axit mạnh bằng bazơ mạnh, tại điểm tương đương nồng độ H⁺ và OH⁻ rất bé, chỉ cần một lượng rất nhỏ bazơ dư cũng làm pH thay đổi đột ngột hàng đơn vị (bước nhảy pH).'
    },
    keywordPuzzle: {
      type: 'science_connection',
      title: 'Phân Loại Các Hợp Chất Hữu Cơ Dược Phẩm',
      instruction: 'Nối các nhóm hợp chất hữu cơ với phản ứng nhận biết đặc trưng trong phòng thí nghiệm.',
      keysUsed: ['KHOA HỌC', 'SÁNG TẠO', 'CHINH PHỤC'],
      connectionPairs: [
        { id: 'c-1', left: 'Andehit / Glucose', right: 'Tạo kết tủa bạc sáng bóng (Tráng bạc Tollens)', category: 'Functional Group' },
        { id: 'c-2', left: 'Anken (Liên kết đôi C=C)', right: 'Làm mất màu dung dịch nước Brom da cam', category: 'Unsaturation' },
        { id: 'c-3', left: 'Ancol Đa chức Liền kề', right: 'Tạo dung dịch phức đồng Cu(OH)₂ màu xanh lam thẫm', category: 'Polyol' },
        { id: 'c-4', left: 'Protein / Lòng trắng trứng', right: 'Phản ứng màu Biuret xuất hiện màu tím đặc trưng', category: 'Peptide' }
      ],
      finalKeyword: 'NEXT GEN',
      explanation: 'Các phản ứng định tính hóa học hữu cơ giúp xác định chính xác nhóm chức cấu tạo của phân tử hợp chất tự nhiên.'
    },
    finalCode: {
      code: 'FTIR-SYNTH-44',
      hint: 'Mật mã cấu trúc phân tử: FTIR-SYNTH-44',
      systemChecksum: '0x44D9B8'
    },
    active: true
  },

  // ==================== PACKAGE 7: SYNTHETIC CHLOROPLAST & ARTIFICIAL PHOTOSYNTHESIS ====================
  {
    id: 'pkg-07',
    packageNumber: 7,
    title: 'Lục Lạp Nhân Tạo & Quang Hợp Tái Sinh Carbon',
    codeName: 'SOLAR-BIO-33',
    theme: 'Hóa Sinh Thực Vật & Năng Lượng Mặt Trời',
    description: 'Thiết kế chu trình Calvin nhân tạo hấp thụ khí CO₂ và tách nước bằng xúc tác nano mô phỏng diệp lục tố.',
    aiScan: {
      title: 'Quét Quang Phổ Hấp Thụ Của Sắc Tố Diệp Lục',
      core: 'biology',
      prompt: 'Diệp lục tố (Chlorophyll a & b) hấp thụ mạnh nhất ở các bước sóng nào để chuyển hóa quang năng thành hóa năng (ATP, NADPH)?',
      systemTelemetry: 'Màng Thylakoid nhân tạo | Cường độ ánh sáng: 1500 µmol/m²s | Nồng độ CO₂: 800 ppm',
      scanTargets: [
        { id: 'scan-1', label: 'Vùng Xanh Lục (500 - 550 nm)', value: 'Phản xạ hoàn toàn', isAnomaly: false, frequency: 'Màu lá cây', description: 'Ánh sáng bị phản xạ nên mắt thấy màu lục' },
        { id: 'scan-2', label: 'Vùng Xanh Tím (430 nm) & Đỏ (660 nm)', value: 'Hấp thụ cực đại', isAnomaly: true, frequency: 'Hiệu suất quang hợp 98%', wavelength: '430 & 660 nm', description: 'Hai đỉnh hấp thụ năng lượng quang hợp cao nhất!' },
        { id: 'scan-3', label: 'Vùng Hồng Ngoại xa (>800 nm)', value: 'Tán xạ nhiệt', isAnomaly: false, frequency: 'Năng lượng thấp', description: 'Không đủ kích hoạt electron diệp lục' },
        { id: 'scan-4', label: 'Vùng Tử Ngoại C (<200 nm)', value: 'Gây ion hóa phá hủy', isAnomaly: false, frequency: 'Bị tầng ozone chặn', description: 'Làm biến tính protein' }
      ],
      correctTargetId: 'scan-2',
      explanation: 'Diệp lục hấp thụ mạnh nhất ở vùng ánh sáng xanh tím (430-450 nm) và vùng đỏ (650-680 nm), hầu như không hấp thụ ánh sáng xanh lục (được phản xạ lại làm cho lá có màu xanh).',
      visualGraphic: 'dna_helix'
    },
    aiErrorDetector: {
      title: 'Phát Hiện Sai Sót Về Nguồn Gốc Oxy Trong Quang Hợp',
      core: 'biology',
      simulationTopic: 'Pha Sáng Của Quang Hợp & Phản Ứng Quang Phân Ly Nước',
      aiSimulationText: 'AI Sinh học đưa ra sơ đồ: "Khí Oxy (O₂) giải phóng ra khí quyển trong quá trình quang hợp có nguồn gốc nguyên tử từ sự phân giải phân tử khí Cacbonic (CO₂) ở pha tối."',
      bugDescription: 'Thí nghiệm đánh dấu đồng vị phóng xạ O-18 của Ruben và Kamen đã chứng minh điều ngược lại.',
      options: [
        { id: 'opt-1', text: 'Sai nguồn gốc oxy: Oxy giải phóng từ pha sáng do quang phân ly nước (2H₂O -> 4H⁺ + 4e + O₂), không phải từ CO₂.', isFlaw: true },
        { id: 'opt-2', text: 'Pha sáng không sinh ra ATP hay NADPH.', isFlaw: false },
        { id: 'opt-3', text: 'Quang hợp chỉ giải phóng khí Nitơ.', isFlaw: false },
        { id: 'opt-4', text: 'Nước chỉ đóng vai trò hòa tan khoáng chất không tham gia phản ứng.', isFlaw: false }
      ],
      correctOptionId: 'opt-1',
      patchExplanation: 'Thí nghiệm dùng đồng vị oxy O¹⁸ chứng minh toàn bộ oxy tự do sinh ra trong quang hợp đều bắt nguồn từ phân tử H₂O bị bẻ gãy ở hệ quang hóa II (PSII) trong pha sáng.'
    },
    scienceCrossover: {
      title: 'Bảo Toàn Năng Lượng & Chu Trình Calvin Chuyển Hóa CO₂',
      coresInvolved: ['biology', 'chemistry'],
      scenario: 'Trong chu trình Calvin, enzyme RuBisCO gắn 1 phân tử CO₂ vào phân tử chất nhận Ribulose-1,5-bisphosphate (RuBP, 5C).',
      scientificDilemma: 'Sản phẩm trung gian đầu tiên được tạo thành gồm 2 phân tử hợp chất hữu cơ có mấy nguyên tử cacbon?',
      options: [
        { id: 'opt-1', text: '2 phân tử Axit 3-Photphoglyxeric (3-PGA, hợp chất 3 Carbon)', reasoning: 'Đặc trưng thực vật C3' },
        { id: 'opt-2', text: '1 phân tử Glucose (6 Carbon) ngay lập tức', reasoning: 'Cần nhiều vòng quay chu trình' },
        { id: 'opt-3', text: 'Axit Oxaloacetic (4 Carbon)', reasoning: 'Đặc trưng thực vật C4' },
        { id: 'opt-4', text: 'Axit Piruvic', reasoning: 'Sản phẩm đường phân' }
      ],
      correctOptionId: 'opt-1',
      explanation: 'RuBP (5C) + CO₂ (1C) -> Hợp chất 6C không bền -> Bẻ gãy ngay thành 2 phân tử 3-PGA (3C). Vì vậy thực vật này được gọi là thực vật C3.'
    },
    aiDataLab: {
      title: 'Phân Tích Cường Độ Ánh Sáng & Điểm Bù - Điểm Bão Hòa Quang Hợp',
      core: 'biology',
      datasetName: 'Cường độ quang hợp (mg CO₂/dm²h) theo cường độ ánh sáng (Lux)',
      chartType: 'kinetics',
      dataPoints: [
        { x: '0 Lux', y: -2.5, label: 'Hô hấp thuần' },
        { x: '1000 Lux', y: 0.0, label: 'Điểm Bù Ánh Sáng' },
        { x: '5000 Lux', y: 15.0, label: 'Tăng tuyến tính' },
        { x: '15000 Lux', y: 35.0, label: 'Điểm Bão Hòa' },
        { x: '25000 Lux', y: 35.0, label: 'Bão hòa' }
      ],
      question: 'Tại điểm bù ánh sáng (1000 Lux), cường độ quang hợp cân bằng chính xác với cường độ hô hấp (cường độ CO₂ hấp thụ ròng = 0). Điểm bão hòa quang hợp đạt được tại bao nhiêu Lux?',
      inputUnit: 'Lux',
      options: [
        { id: 'opt-1', text: '15,000 Lux (cường độ quang hợp đạt cực đại 35 mg CO₂/dm²h)' },
        { id: 'opt-2', text: '1,000 Lux' },
        { id: 'opt-3', text: '5,000 Lux' },
        { id: 'opt-4', text: '0 Lux' }
      ],
      correctOptionId: 'opt-1',
      numericalTarget: 15000,
      numericalTolerance: 500,
      explanation: 'Từ 15,000 Lux trở lên, cường độ quang hợp không tăng thêm dù tăng cường độ ánh sáng, vì vậy 15,000 Lux chính là điểm bão hòa ánh sáng.'
    },
    keywordPuzzle: {
      type: 'sort',
      title: 'Dòng Chuyền Electron Quang Hợp Trên Màng Thylakoid',
      instruction: 'Sắp xếp trật tự di chuyển của electron năng lượng cao trong chuỗi chuyền điện tử pha sáng.',
      keysUsed: ['KHOA HỌC', 'SÁNG TẠO', 'CHINH PHỤC'],
      sortItems: [
        { id: 's-1', text: 'Quang phân ly nước giải phóng e⁻ tại Trung tâm phản ứng P680 (PSII)', correctOrder: 1 },
        { id: 's-2', text: 'Chuyền qua phức hệ Plastoquinone và Cytochrome b₆f bơm H⁺ vào xoang', correctOrder: 2 },
        { id: 's-3', text: 'Tiếp nhận thêm năng lượng photon tại Hệ quang hóa I P700 (PSI)', correctOrder: 3 },
        { id: 's-4', text: 'Enzyme Ferredoxin-NADP⁺ reductase tổng hợp hợp chất khử NADPH', correctOrder: 4 }
      ],
      finalKeyword: 'NEXT GEN',
      explanation: 'Sơ đồ Z-scheme truyền electron: H₂O -> PSII (P680) -> Chuỗi truyền điện tử -> PSI (P700) -> Ferredoxin -> NADPH.'
    },
    finalCode: {
      code: 'SOLAR-BIO-33',
      hint: 'Mật mã lục lạp năng lượng mặt trời: SOLAR-BIO-33',
      systemChecksum: '0x33A8C7'
    },
    active: true
  },

  // ==================== PACKAGE 8: QUANTUM CRYPTOGRAPHY & ENTANGLEMENT ====================
  {
    id: 'pkg-08',
    packageNumber: 8,
    title: 'Mật Mã Lượng Tử & Rối Lượng Tử BB84',
    codeName: 'QUANTUM-KEY-22',
    theme: 'Vật Lí Lượng Tử & An Ninh Mạng Tương Lai',
    description: 'Thiết lập kênh truyền khóa lượng tử (QKD) bất khả xâm phạm dựa trên định lý không thể nhân bản (No-Cloning Theorem).',
    aiScan: {
      title: 'Quét Trạng Thái Phân Cực Của Photon Lượng Tử',
      core: 'physics',
      prompt: 'Trạm thu phát photon đơn lẻ đang truyền khóa. Hãy chọn cơ sở phân cực trùng khớp để đo trạng thái qubit mà không làm sụp đổ hàm sóng.',
      systemTelemetry: 'Tốc độ tạo photon: 10 MHz | Tỉ lệ lỗi bit lượng tử (QBER): 1.2% | Khoảng cách cáp quang: 50 km',
      scanTargets: [
        { id: 'scan-1', label: 'Cơ sở Trực giao Rectilinear (+)', value: '|0⟩ (Ngang 0°) & |1⟩ (Dọc 90°)', isAnomaly: true, frequency: 'Cơ sở chuẩn', wavelength: '1550 nm', description: 'Đo chính xác photon phân cực trực giao không bị nhiễu!' },
        { id: 'scan-2', label: 'Cơ sở Chéo Diagonal (×)', value: '|+⟩ (45°) & |-⟩ (135°)', isAnomaly: false, frequency: 'Cơ sở chéo', description: 'Cơ sở lệch 45 độ' },
        { id: 'scan-3', label: 'Giao thoa ngẫu nhiên', value: 'Mất liên kết pha', isAnomaly: false, frequency: 'Nhiễu nhiệt', description: 'Tín hiệu bị tán xạ trên đường truyền' },
        { id: 'scan-4', label: 'Nghe trộm (Eve)', value: 'QBER tăng vọt > 25%', isAnomaly: false, frequency: 'Cảnh báo can thiệp', description: 'Phát hiện kẻ nghe trộm làm sụp đổ hàm sóng' }
      ],
      correctTargetId: 'scan-1',
      explanation: 'Giao thức BB84 sử dụng hai cơ sở phân cực (+ và ×). Khi bên gửi (Alice) và bên nhận (Bob) chọn cùng cơ sở, kết quả đo chắc chắn tương quan 100% để tạo khóa bí mật.',
      visualGraphic: 'particle_collision'
    },
    aiErrorDetector: {
      title: 'Phát Hiện Sai Sót Về Tốc Độ Truyền Thông Tin Lượng Tử',
      core: 'physics',
      simulationTopic: 'Hiện Tượng Rối Lượng Tử (Quantum Entanglement) và Thuyết Tương Đối',
      aiSimulationText: 'AI Mạng tuyên bố: "Bằng cách đo trạng thái của một photon trong cặp rối lượng tử, ta có thể truyền tín hiệu tin nhắn có ý nghĩa tức thời vượt tốc độ ánh sáng đến ngân hà khác."',
      bugDescription: 'Định lý cấm truyền tin nhanh hơn ánh sáng (No-Communication Theorem) đã bị AI hiểu sai.',
      options: [
        { id: 'opt-1', text: 'Hiểu sai: Dù tương quan lượng tử là tức thời, kết quả đo ở mỗi đầu là hoàn toàn ngẫu nhiên; muốn giải mã thông điệp bắt buộc phải gửi thông tin cổ điển qua kênh thông thường (tối đa bằng tốc độ ánh sáng c).', isFlaw: true },
        { id: 'opt-2', text: 'Rối lượng tử chỉ xảy ra ở nhiệt độ 0 tuyệt đối.', isFlaw: false },
        { id: 'opt-3', text: 'Ánh sáng có thể truyền với vận tốc vô cực.', isFlaw: false },
        { id: 'opt-4', text: 'Photon không có tính chất sóng.', isFlaw: false }
      ],
      correctOptionId: 'opt-1',
      patchExplanation: 'Rối lượng tử thể hiện sự bất khả phân của hệ lượng tử, nhưng không thể dùng để truyền dữ liệu hữu ích nhanh hơn vận tốc ánh sáng c, hoàn toàn phù hợp với thuyết tương đối hẹp của Einstein.'
    },
    scienceCrossover: {
      title: 'Định Lý Bất Định Heisenberg & Bảo Mật Khóa Lượng Tử',
      coresInvolved: ['physics', 'ai_tech'],
      scenario: 'Nếu có kẻ nghe trộm (Eve) cố gắng sao chép trạng thái photon truyền giữa Alice và Bob trên đường truyền quang.',
      scientificDilemma: 'Nguyên lý vật lí lượng tử nào khiến hành vi nghe trộm của Eve chắc chắn bị phát hiện ngay lập tức?',
      options: [
        { id: 'opt-1', text: 'Nguyên lý Bất định Heisenberg và Định lý cấm nhân bản (No-Cloning): Mọi phép đo lượng tử đều làm sụp đổ hàm sóng và thay đổi trạng thái photon, làm tăng tỉ lệ lỗi QBER.', reasoning: 'Bản chất cơ học lượng tử' },
        { id: 'opt-2', text: 'Địa chỉ IP của kẻ nghe trộm bị router ghi lại.', reasoning: 'Cơ chế mạng cổ điển' },
        { id: 'opt-3', text: 'Eve sẽ bị giật điện từ trường.', reasoning: 'Vô lý' },
        { id: 'opt-4', text: 'Tia laser sẽ tự đổi hướng quay về máy chủ.', reasoning: 'Sai' }
      ],
      correctOptionId: 'opt-1',
      explanation: 'Theo định lý No-Cloning, không thể tạo bản sao hoàn hảo của một trạng thái lượng tử chưa biết. Bất kỳ phép đo nào của Eve cũng làm biến đổi trạng thái photon, gây lỗi bit và kích hoạt báo động.'
    },
    aiDataLab: {
      title: 'Tỉ Lệ Lỗi Bit Lượng Tử QBER & Ngưỡng An Toàn Hệ Thống',
      core: 'ai_tech',
      datasetName: 'Biến thiên tỉ lệ lỗi QBER (%) theo sự can thiệp của kênh truyền',
      chartType: 'neural_loss',
      dataPoints: [
        { x: '0% can thiệp', y: 1.1, label: 'Kênh sạch' },
        { x: '10% can thiệp', y: 3.5, label: 'An toàn' },
        { x: '25% can thiệp', y: 7.8, label: 'Ngưỡng tới hạn' },
        { x: '50% can thiệp', y: 14.2, label: 'Mất an toàn' },
        { x: '100% can thiệp', y: 25.0, label: 'Eve chặn hoàn toàn' }
      ],
      question: 'Trong giao thức BB84, nếu tỉ lệ lỗi QBER vượt quá ngưỡng lý thuyết 11%, hệ thống kết luận có kẻ nghe trộm và hủy bỏ khóa. Ngưỡng lỗi tối đa khi Eve đo toàn bộ trên cơ sở ngẫu nhiên là bao nhiêu?',
      inputUnit: '%',
      options: [
        { id: 'opt-1', text: '25.0% lỗi bit (khi Eve chọn sai cơ sở 50% số lần)' },
        { id: 'opt-2', text: '50.0% lỗi bit' },
        { id: 'opt-3', text: '5.0% lỗi bit' },
        { id: 'opt-4', text: '0.0% lỗi bit' }
      ],
      correctOptionId: 'opt-1',
      numericalTarget: 25,
      numericalTolerance: 1,
      explanation: 'Khi Eve đo chặn toàn bộ: 50% chọn đúng cơ sở (không gây lỗi), 50% chọn sai cơ sở (dẫn đến Bob có 50% khả năng đo sai). Tỉ lệ lỗi tổng thể = 50% * 50% = 25%.'
    },
    keywordPuzzle: {
      type: 'science_connection',
      title: 'Cặp Khái Niệm Vật Lí Lượng Tử & Mật Mã BB84',
      instruction: 'Nối chính xác các nguyên lý cơ học lượng tử với ứng dụng an ninh bảo mật thông tin tương ứng.',
      keysUsed: ['KHOA HỌC', 'SÁNG TẠO', 'CHINH PHỤC'],
      connectionPairs: [
        { id: 'qk-1', left: 'Trạng Thái Chồng Chập (Superposition)', right: 'Qubit mang đồng thời cả hai trạng thái |0⟩ và |1⟩', category: 'Quantum' },
        { id: 'qk-2', left: 'Định Lý Cấm Nhân Bản (No-Cloning)', right: 'Ngăn chặn kẻ nghe trộm tạo bản sao photon lượng tử', category: 'Security' },
        { id: 'qk-3', left: 'Rối Lượng Tử (Quantum Entanglement)', right: 'Tương quan tức thời giữa 2 hạt photon cách xa nhau', category: 'Physics' },
        { id: 'qk-4', left: 'Tỉ Lệ Lỗi QBER Vượt Ngưỡng 11%', right: 'Dấu hiệu phát hiện có kẻ nghe trộm can thiệp đường truyền', category: 'Detection' }
      ],
      finalKeyword: 'NEXT GEN',
      explanation: 'An ninh mạng lượng tử dựa trên các định luật vật lí tự nhiên bất biến thay vì độ phức tạp tính toán.'
    },
    finalCode: {
      code: 'QUANTUM-KEY-22',
      hint: 'Mật mã chìa khóa phân cực photon: QUANTUM-KEY-22',
      systemChecksum: '0x22F7B3'
    },
    active: true
  },

  // ==================== PACKAGE 9 TO 16: DIVERSE ADVANCED DOMAINS ====================
  {
    id: 'pkg-09',
    packageNumber: 9,
    title: 'Khí Quyển Ngoại Hành Tinh & Dấu Vết Sinh Học James Webb',
    codeName: 'EXOPLANET-BIO-91',
    theme: 'Thiên Văn Vật Lí & Hóa Học Vũ Trụ',
    description: 'Phân tích vạch phổ hấp thụ trong khí quyển hành tinh ngoại K2-18b phát hiện phân tử Dimethyl Sulfide (DMS).',
    aiScan: {
      title: 'Quét Vạch Phổ Hấp Thụ Phân Tử Hữu Cơ',
      core: 'physics',
      prompt: 'Kính viễn vọng James Webb truyền về quang phổ truyền qua. Hãy phát hiện pic hấp thụ của khí Metan (CH₄) và Dimethyl Sulfide.',
      systemTelemetry: 'Nhiệt độ hành tinh: 290 K | Bán kính: 2.6 R_Earth | Vùng sống được (Habitable Zone)',
      scanTargets: [
        { id: 'scan-1', label: 'Vạch CO₂', value: '4.3 µm', isAnomaly: false, frequency: 'Hiệu ứng nhà kính', description: 'Khí quyển giàu CO₂' },
        { id: 'scan-2', label: 'Vạch Metan (CH₄) & DMS (C₂H₆S)', value: '3.3 µm & 7.1 µm', isAnomaly: true, frequency: 'Dấu vết sinh học', wavelength: '3.3 µm', description: 'Chỉ thị hoạt động sinh học của vi sinh vật biển ngoại hành tinh!' },
        { id: 'scan-3', label: 'Vạch Hơi nước H₂O', value: '1.4 µm', isAnomaly: false, frequency: 'Mây đại dương', description: 'Đại dương nước lỏng' },
        { id: 'scan-4', label: 'Vạch Argon trơ', value: '0.8 µm', isAnomaly: false, frequency: 'Khí hiếm', description: 'Không phản ứng' }
      ],
      correctTargetId: 'scan-2',
      explanation: 'Khí Dimethyl sulfide (DMS) trên Trái Đất phần lớn do sinh vật phù du biển sinh ra; sự hiện diện đồng thời của CH₄ và DMS là dấu hiệu tiềm năng của sự sống ngoài hành tinh.',
      visualGraphic: 'tokamak_reactor'
    },
    aiErrorDetector: {
      title: 'Phát Hiện Sai Sót Định Luật Dịch Chuyển Đỏ Doppler',
      core: 'physics',
      simulationTopic: 'Hiện Tượng Dịch Chuyển Đỏ Vũ Trụ (Redshift) và Định Luật Hubble',
      aiSimulationText: 'AI Thiên văn báo cáo: "Thiên hà xa xôi đang tiến lại gần Trái Đất với tốc độ cao làm cho quang phổ dịch chuyển về phía bước sóng dài hơn (về phía màu đỏ)."',
      bugDescription: 'Hiệu ứng Doppler quang học bị AI giải thích ngược chiều bước sóng.',
      options: [
        { id: 'opt-1', text: 'Sai chiều dịch chuyển: Khi thiên thể lùi ra xa thì bước sóng mới bị dãn dài (dịch chuyển đỏ); nếu tiến lại gần thì bước sóng bị co ngắn lại (dịch chuyển xanh).', isFlaw: true },
        { id: 'opt-2', text: 'Vũ trụ không giãn nở.', isFlaw: false },
        { id: 'opt-3', text: 'Ánh sáng thiên hà không có phổ vạch.', isFlaw: false },
        { id: 'opt-4', text: 'Kính James Webb không dùng cảm biến hồng ngoại.', isFlaw: false }
      ],
      correctOptionId: 'opt-1',
      patchExplanation: 'Hiệu ứng Doppler: Khi nguồn phát chuyển động ra xa người quan sát, bước sóng quan sát được λ\' = λ(1 + v/c) dài hơn bước sóng phát ra, quang phổ dịch về phía đỏ.'
    },
    scienceCrossover: {
      title: 'Áp Suất Khí Quyển & Điểm Sôi Của Nước Trên Hành Tinh',
      coresInvolved: ['physics', 'chemistry'],
      scenario: 'Trên hành tinh đại dương Hycean có áp suất bề mặt P = 5 atm lớn hơn nhiều so với Trái Đất (1 atm).',
      scientificDilemma: 'Nhiệt độ sôi của nước lỏng trên bề mặt hành tinh này sẽ thay đổi như thế nào theo phương trình Clausius-Clapeyron?',
      options: [
        { id: 'opt-1', text: 'Nhiệt độ sôi của nước tăng cao hơn 100°C (khoảng 152°C) do áp suất ngoại lớn cản trở phân tử nước bốc hơi.', reasoning: 'Nhiệt động lực học chính xác' },
        { id: 'opt-2', text: 'Nước sẽ sôi ở 0°C và đóng băng ngay.', reasoning: 'Sai' },
        { id: 'opt-3', text: 'Nhiệt độ sôi luôn cố định đúng 100°C trong toàn vũ trụ.', reasoning: 'Sai' },
        { id: 'opt-4', text: 'Nước bị phân hủy thành hạt quark.', reasoning: 'Vô lý' }
      ],
      correctOptionId: 'opt-1',
      explanation: 'Nhiệt độ sôi tăng khi áp suất môi trường tăng. Ở áp suất 5 atm (khoảng 500 kPa), nước chỉ sôi khi đạt khoảng 152°C, cho phép nước tồn tại ở thể lỏng ở nhiệt độ rất cao.'
    },
    aiDataLab: {
      title: 'Tính Bán Kính Hành Tinh Bằng Phương Pháp Chuyển Tiếp Transit',
      core: 'physics',
      datasetName: 'Độ sụt giảm ánh sáng của sao mẹ ΔF/F khi hành tinh đi ngang qua',
      chartType: 'spectrum',
      dataPoints: [
        { x: 'Trước transit', y: 1.000, label: '100% sáng' },
        { x: 'Bắt đầu che khuất', y: 0.995, label: 'Sụt giảm' },
        { x: 'Che khuất toàn phần', y: 0.990, label: 'ΔF/F = 1%' },
        { x: 'Kết thúc transit', y: 1.000, label: 'Khôi phục' }
      ],
      question: 'Độ sụt giảm độ sáng tối đa là 1% (ΔF/F = 0.01). Biết sao mẹ có bán kính R_sao = 1.0 R_Mặt Trời (700,000 km), bán kính hành tinh R_p tính theo công thức (R_p / R_sao)² = ΔF/F bằng bao nhiêu?',
      inputUnit: 'km',
      options: [
        { id: 'opt-1', text: 'R_p = 0.10 R_sao = 70,000 km (kích thước sao Mộc)' },
        { id: 'opt-2', text: 'R_p = 0.01 R_sao = 7,000 km' },
        { id: 'opt-3', text: 'R_p = 700,000 km' },
        { id: 'opt-4', text: 'R_p = 700 km' }
      ],
      correctOptionId: 'opt-1',
      numericalTarget: 70000,
      numericalTolerance: 1000,
      explanation: 'Ta có (R_p / R_sao)² = 0.01 => R_p / R_sao = √0.01 = 0.1. Do đó R_p = 0.1 * 700,000 km = 70,000 km.'
    },
    keywordPuzzle: {
      type: 'science_connection',
      title: 'Phân Hạng Các Loại Hành Tinh Trong Vũ Trụ',
      instruction: 'Nối tên các loại thiên thể với đặc điểm cấu tạo tương ứng.',
      keysUsed: ['KHOA HỌC', 'SÁNG TẠO', 'CHINH PHỤC'],
      connectionPairs: [
        { id: 'e-1', left: 'Hành tinh Đất đá (Terrestrial)', right: 'Có bề mặt rắn, giàu Silic và Kim loại (Trái Đất, Sao Hỏa)', category: 'Planetary' },
        { id: 'e-2', left: 'Hành tinh Khí khổng lồ (Gas Giant)', right: 'Chủ yếu gồm khí Hydro và Heli (Sao Mộc, Sao Thổ)', category: 'Planetary' },
        { id: 'e-3', left: 'Hành tinh Băng khổng lồ (Ice Giant)', right: 'Chứa hợp chất dễ bay hơi như Nước, Amoniac, Metan', category: 'Planetary' },
        { id: 'e-4', left: 'Hành tinh Hycean', right: 'Đại dương nước lỏng bao phủ dưới khí quyển giàu Hydro', category: 'Habitability' }
      ],
      finalKeyword: 'NEXT GEN',
      explanation: 'Sự đa dạng của các hệ hành tinh ngoại giúp khoa học mở rộng ranh giới tìm kiếm môi trường sống bên ngoài Trái Đất.'
    },
    finalCode: {
      code: 'EXOPLANET-BIO-91',
      hint: 'Mật mã đại dương vũ trụ: EXOPLANET-BIO-91',
      systemChecksum: '0x91C2E6'
    },
    active: true
  },

  {
    id: 'pkg-10',
    packageNumber: 10,
    title: 'Siêu Dẫn Nhiệt Độ Cao & Tàu Đệm Từ Maglev',
    codeName: 'MAGLEV-SUPER-10',
    theme: 'Vật Lí Chất Rắn & Công Nghệ Siêu Dẫn',
    description: 'Ứng dụng hiệu ứng Meissner và khóa từ thông (Flux Pinning) để điều khiển tàu đệm từ tốc độ 600 km/h không ma sát cơ học.',
    aiScan: {
      title: 'Quét Nhiệt Độ Tới Hạn Siêu Dẫn (Tc)',
      core: 'physics',
      prompt: 'Vật liệu gốm YBCO (YBa₂Cu₃O₇) chuyển pha sang trạng thái siêu dẫn hoàn toàn. Hãy quét điểm nhiệt độ tới hạn Tc nơi điện trở đột ngột rơi về đúng 0 Ohm.',
      systemTelemetry: 'Nito lỏng làm lạnh: 77 K | Điện trở suất: ρ = 0.00 Ω.m | Độ cảm từ χ = -1 (Nghịch từ tuyệt đối)',
      scanTargets: [
        { id: 'scan-1', label: 'Vùng 293 K (Nhiệt độ phòng)', value: 'ρ = 1.5×10⁻⁵ Ω.m', isAnomaly: false, frequency: 'Dẫn điện kim loại', description: 'Có điện trở và tỏa nhiệt Joule' },
        { id: 'scan-2', label: 'Điểm Chuyển Pha Siêu Dẫn Tc', value: '93 K (-180°C)', isAnomaly: true, frequency: 'Điện trở R = 0 Ω', wavelength: 'Meissner', description: 'Đạt trạng thái siêu dẫn và đẩy hoàn toàn từ trường!' },
        { id: 'scan-3', label: 'Vùng 150 K', value: 'ρ giảm tuyến tính', isAnomaly: false, frequency: 'Chưa siêu dẫn', description: 'Nhiệt độ còn cao hơn Tc' },
        { id: 'scan-4', label: 'Vùng 4.2 K (Heli lỏng)', value: 'Siêu dẫn kim loại chì', isAnomaly: false, frequency: 'Lãng phí chi phí', description: 'Chất làm lạnh đắt đỏ' }
      ],
      correctTargetId: 'scan-2',
      explanation: 'Hợp chất YBCO là chất siêu dẫn nhiệt độ cao (HTS) đầu tiên được phát hiện có nhiệt độ tới hạn Tc = 93 K, cao hơn điểm sôi của Nitơ lỏng (77 K), cho phép ứng dụng công nghiệp giá rẻ.',
      visualGraphic: 'tokamak_reactor'
    },
    aiErrorDetector: {
      title: 'Phát Hiện Sai Sót Định Luật Ôm Trong Chất Siêu Dẫn',
      core: 'physics',
      simulationTopic: 'Định luật Ôm và Định luật Joule - Lenz Trong Chất Siêu Dẫn',
      aiSimulationText: 'AI Simulator tính toán: "Khi dòng điện cảm ứng siêu dẫn I = 5000A chạy qua cuộn dây siêu dẫn có R = 0 trong 1 năm, nhiệt lượng tỏa ra trên cuộn dây tính theo công thức Q = I²Rt là 500 MegaJoule."',
      bugDescription: 'Khi điện trở thuần R = 0 thì nhiệt lượng tỏa ra bắt buộc phải bằng không.',
      options: [
        { id: 'opt-1', text: 'Sai toán học vật lí: Khi điện trở R = 0, nhiệt lượng Q = I²Rt = 0 Joules; dòng điện siêu dẫn chạy vĩnh cửu mà không hề tiêu hao năng lượng hay tỏa nhiệt.', isFlaw: true },
        { id: 'opt-2', text: 'Chất siêu dẫn không thể dẫn dòng điện lớn hơn 1A.', isFlaw: false },
        { id: 'opt-3', text: 'Dòng điện chỉ chạy được trong chất khí.', isFlaw: false },
        { id: 'opt-4', text: 'Nhiệt lượng tỏa ra tỷ lệ nghịch với thời gian.', isFlaw: false }
      ],
      correctOptionId: 'opt-1',
      patchExplanation: 'Vì điện trở suất của chất siêu dẫn hoàn toàn bằng 0, không có sự tán xạ electron trên mạng tinh thể, nên không có hiện tượng tỏa nhiệt Joule (Q = 0), dòng điện tồn tại bền vững hàng triệu năm.'
    },
    scienceCrossover: {
      title: 'Khóa Từ Thông (Quantum Levitation) & Lực Từ Lorentz',
      coresInvolved: ['physics', 'ai_tech'],
      scenario: 'Trong chất siêu dẫn loại II, từ trường xuyên qua thành các ống lượng tử nhỏ li ti gọi là xoáy từ (Vortex), bị ghim chặt vào các khuyết tật mạng tinh thể.',
      scientificDilemma: 'Hiện tượng ghim từ thông (Flux Pinning) tạo ra đặc tính cơ học độc đáo nào cho tàu đệm từ Maglev?',
      options: [
        { id: 'opt-1', text: 'Tàu bị khóa cứng ở một khoảng cách cố định trong không gian so với đường ray, dù lật ngược ray tàu vẫn lơ lửng không rơi.', reasoning: 'Cơ học lượng tử thực tế' },
        { id: 'opt-2', text: 'Tàu bị hút dính chặt vào ray không thể chuyển động.', reasoning: 'Sai' },
        { id: 'opt-3', text: 'Tàu bay thẳng vào vũ trụ.', reasoning: 'Vô lý' },
        { id: 'opt-4', text: 'Đường ray bị biến thành chất lỏng.', reasoning: 'Sai' }
      ],
      correctOptionId: 'opt-1',
      explanation: 'Khóa từ thông (Flux Pinning) trong chất siêu dẫn loại II giữ cho vật thể bị khóa cố định ở vị trí lơ lửng trong không gian ba chiều, tạo sự ổn định tuyệt đối mà không cần cảm biến điều khiển.'
    },
    aiDataLab: {
      title: 'Đường Cong Điện Trở Biến Thiên Theo Nhiệt Độ Của Gốm Siêu Dẫn',
      core: 'physics',
      datasetName: 'Giá trị điện trở (mΩ) theo nhiệt độ Kelvin (K)',
      chartType: 'spectrum',
      dataPoints: [
        { x: '120 K', y: 15.0, label: 'Kim loại' },
        { x: '100 K', y: 12.0, label: 'Kim loại' },
        { x: '94 K', y: 11.2, label: 'Bắt đầu tụt' },
        { x: '93 K', y: 0.00, label: 'Tc - Siêu dẫn' },
        { x: '80 K', y: 0.00, label: 'Siêu dẫn' }
      ],
      question: 'Dựa vào dữ liệu đo, tại nhiệt độ nào (Tc) điện trở của mẫu rơi thẳng đứng từ 11.2 mΩ xuống chính xác 0.00 mΩ?',
      inputUnit: 'Kelvin (K)',
      options: [
        { id: 'opt-1', text: 'Tc = 93 K (-180.15 °C)' },
        { id: 'opt-2', text: 'Tc = 120 K' },
        { id: 'opt-3', text: 'Tc = 0 K' },
        { id: 'opt-4', text: 'Tc = 77 K' }
      ],
      correctOptionId: 'opt-1',
      numericalTarget: 93,
      numericalTolerance: 0.5,
      explanation: 'Tại đúng 93 K, điện trở suất giảm đột ngột về 0, đánh dấu bước chuyển pha sang trạng thái siêu dẫn của mẫu YBCO.'
    },
    keywordPuzzle: {
      type: 'sort',
      title: 'Các Hiện Tượng Vật Lí Lượng Tử Đột Phá',
      instruction: 'Sắp xếp theo thứ tự phát hiện các mốc lịch sử vật lí lượng tử.',
      keysUsed: ['KHOA HỌC', 'SÁNG TẠO', 'CHINH PHỤC'],
      sortItems: [
        { id: 'h-1', text: 'Thuyết lượng tử ánh sáng của Max Planck & Einstein (1900 - 1905)', correctOrder: 1 },
        { id: 'h-2', text: 'Phát hiện tính siêu dẫn ở Thủy ngân của Kamerlingh Onnes (1911)', correctOrder: 2 },
        { id: 'h-3', text: 'Mô hình lý thuyết vi mô BCS về cặp electron Cooper (1957)', correctOrder: 3 },
        { id: 'h-4', text: 'Phát hiện chất siêu dẫn nhiệt độ cao YBCO vượt 77K (1987)', correctOrder: 4 }
      ],
      finalKeyword: 'NEXT GEN',
      explanation: 'Lịch sử phát triển của vật lí chất rắn từ siêu dẫn nhiệt độ Heli lỏng đến siêu dẫn nhiệt độ Nitơ lỏng và tương lai siêu dẫn nhiệt độ phòng.'
    },
    finalCode: {
      code: 'MAGLEV-SUPER-10',
      hint: 'Mật mã tàu đệm từ siêu tốc: MAGLEV-SUPER-10',
      systemChecksum: '0x10A9D4'
    },
    active: true
  },

  {
    id: 'pkg-11',
    packageNumber: 11,
    title: 'Nanobot Y Sinh & Dẫn Thuốc Đích Phân Tử',
    codeName: 'NANOBOT-MED-11',
    theme: 'Công Nghệ Nano & Y Dược Chính Xác',
    description: 'Lập trình robot kích thước nano tự hành luồn lách qua mao mạch máu để tiêu diệt tế bào ung thư đích.',
    aiScan: {
      title: 'Quét Thụ Thể Khối U Đặc Hiệu Bề Mặt Tế Bào',
      core: 'biology',
      prompt: 'Cảm biến nanobot đang quét màng tế bào. Hãy phát hiện thụ thể HER2/neu biểu hiện quá mức trên bề mặt tế bào ác tính để giải phóng kháng thể điều trị.',
      systemTelemetry: 'Kích thước robot: 85 nm | Vận tốc bơi micro: 15 µm/s | Nguồn động lực: Xúc tác enzyme catalase',
      scanTargets: [
        { id: 'scan-1', label: 'Thụ thể Insulin lành tính', value: '1,000 / tế bào', isAnomaly: false, frequency: 'Tế bào thường', description: 'Không tấn công tế bào khỏe mạnh' },
        { id: 'scan-2', label: 'Thụ Thể Ung Thư HER2 Khuyếch Đại', value: '2,000,000 / tế bào', isAnomaly: true, frequency: 'Bất thường gấp 2000 lần', wavelength: '85 nm', description: 'Mục tiêu đích! Kích hoạt mở khóa nang chứa dược chất!' },
        { id: 'scan-3', label: 'Kênh Aquaporin dẫn nước', value: 'Màng sinh chất', isAnomaly: false, frequency: 'Sinh lí bình thường', description: 'Bảo vệ màng tế bào' },
        { id: 'scan-4', label: 'Kháng nguyên nhóm máu ABO', value: 'Hồng cầu', isAnomaly: false, frequency: 'Không gây tan máu', description: 'Hồng cầu bình thường' }
      ],
      correctTargetId: 'scan-2',
      explanation: 'Tế bào ung thư vú thể HER2-positive có lượng thụ thể HER2 trên màng tăng gấp hàng nghìn lần so với tế bào thường, là thụ thể đích hoàn hảo cho liệu pháp trúng đích (Targeted Therapy).',
      visualGraphic: 'dna_helix'
    },
    aiErrorDetector: {
      title: 'Phát Hiện Sai Sót Trong Cơ Chế Thực Bào Và Thực Thể Miễn Dịch',
      core: 'biology',
      simulationTopic: 'Hệ Thống Miễn Dịch & Đại Thực Bào (Macrophage)',
      aiSimulationText: 'AI Y sinh cho rằng: "Tế bào ung thư không bị đại thực bào tiêu diệt vì tế bào ung thư hoàn toàn không có màng tế bào sinh chất bao bọc."',
      bugDescription: 'Tất cả tế bào sinh vật nhân thực đều bắt buộc phải có màng sinh chất; lý do ung thư thoát miễn dịch là nhờ phân tử tín hiệu "Đừng ăn tôi" (CD47).',
      options: [
        { id: 'opt-1', text: 'Sai bản chất: Tế bào ung thư có màng tế bào đầy đủ; chúng thoát khỏi thực bào bằng cách biểu hiện quá mức protein CD47 phát tín hiệu ức chế đại thực bào.', isFlaw: true },
        { id: 'opt-2', text: 'Đại thực bào không thể di chuyển trong máu.', isFlaw: false },
        { id: 'opt-3', text: 'Tế bào ung thư là virus chứ không phải tế bào.', isFlaw: false },
        { id: 'opt-4', text: 'Hệ miễn dịch không có tế bào lympho T.', isFlaw: false }
      ],
      correctOptionId: 'opt-1',
      patchExplanation: 'Khối u đánh lừa hệ thống miễn dịch thông qua các chốt kiểm soát miễn dịch (Checkpoint) như PD-L1 và protein màng CD47 truyền tín hiệu "Do not eat me" cho đại thực bào.'
    },
    scienceCrossover: {
      title: 'Hóa Học Polymer Nhạy Cảm pH & Giải Phóng Thuốc Đích',
      coresInvolved: ['chemistry', 'biology'],
      scenario: 'Môi trường vi mô xung quanh khối u có tính axit nhẹ (pH ≈ 6.5) do hiệu ứng Warburg (lên men lactic tăng cao), khác với mô bình thường (pH = 7.4).',
      scientificDilemma: 'Cấu trúc nang hạt nano nên thiết kế bằng liên kết hóa học nào để tự động vỡ ra khi gặp môi trường axit khối u?',
      options: [
        { id: 'opt-1', text: 'Liên kết Hydrazone hoặc Acetal nhạy cảm axit: bền ở pH 7.4 nhưng thủy phân nhanh ở pH axit 6.5 để nhả thuốc.', reasoning: 'Hóa dược chính xác' },
        { id: 'opt-2', text: 'Lớp vỏ bằng vàng đúc đặc không bao giờ tan.', reasoning: 'Thuốc không thoát ra được' },
        { id: 'opt-3', text: 'Dùng kiềm đặc NaOH bọc ngoài.', reasoning: 'Gây hoại tử toàn cơ thể' },
        { id: 'opt-4', text: 'Chất kết dính xi măng silicat.', reasoning: 'Vô lý' }
      ],
      correctOptionId: 'opt-1',
      explanation: 'Hệ dẫn thuốc thông minh (Smart Drug Delivery) sử dụng các polymer đáp ứng kích thích pH (pH-responsive polymers) mang liên kết dễ thủy phân trong môi trường axit cục bộ của mô u.'
    },
    aiDataLab: {
      title: 'Hiệu Quả Ức Chế Khối U Bằng Nồng Độ Ức Chế Bán Phần IC50',
      core: 'chemistry',
      datasetName: 'Phần trăm tế bào ung thư sống sót theo nồng độ hạt nano (µg/mL)',
      chartType: 'kinetics',
      dataPoints: [
        { x: '0.1 µg/mL', y: 95.0, label: 'Ít tác dụng' },
        { x: '1.0 µg/mL', y: 78.0, label: 'Bắt đầu ức chế' },
        { x: '5.0 µg/mL', y: 50.0, label: 'IC50' },
        { x: '10 µg/mL', y: 22.0, label: 'Ức chế mạnh' },
        { x: '50 µg/mL', y: 4.0, label: 'Tiêu diệt 96%' }
      ],
      question: 'Chỉ số IC50 (Half maximal inhibitory concentration) biểu thị nồng độ thuốc làm giảm 50% số tế bào sống sót. Dựa vào đồ thị, IC50 của hạt nano là bao nhiêu µg/mL?',
      inputUnit: 'µg/mL',
      options: [
        { id: 'opt-1', text: 'IC50 = 5.0 µg/mL (nồng độ tối ưu để đạt 50% ức chế)' },
        { id: 'opt-2', text: 'IC50 = 50.0 µg/mL' },
        { id: 'opt-3', text: 'IC50 = 0.1 µg/mL' },
        { id: 'opt-4', text: 'IC50 = 100 µg/mL' }
      ],
      correctOptionId: 'opt-1',
      numericalTarget: 5.0,
      numericalTolerance: 0.2,
      explanation: 'Tại nồng độ 5.0 µg/mL, tỷ lệ tế bào sống sót rơi đúng mức 50.0%. Đây là định nghĩa chuẩn của chỉ số dược lực học IC50.'
    },
    keywordPuzzle: {
      type: 'science_connection',
      title: 'Công Nghệ Y Dược Phân Tử Hiện Đại',
      instruction: 'Nối các giải pháp công nghệ y học với ứng dụng lâm sàng tương ứng.',
      keysUsed: ['KHOA HỌC', 'SÁNG TẠO', 'CHINH PHỤC'],
      connectionPairs: [
        { id: 'nb-1', left: 'Liposome & Hạt Nano Lipid (LNP)', right: 'Vỏ bọc vận chuyển vaccine mRNA vào tế bào', category: 'Nanomedicine' },
        { id: 'nb-2', left: 'Kháng thể Đơn dòng (mAb)', right: 'Nhận diện ổ khóa - chìa khóa thụ thể khối u', category: 'Immunology' },
        { id: 'nb-3', left: 'Liệu pháp Tế bào CAR-T', right: 'Tái lập trình tế bào T của bệnh nhân để diệt ung thư', category: 'Cell Therapy' },
        { id: 'nb-4', left: 'Hiệu ứng EPR (Thấm và Giữ Tăng cường)', right: 'Tích tụ tự nhiên của hạt nano vào mao mạch khối u', category: 'Pathology' }
      ],
      finalKeyword: 'NEXT GEN',
      explanation: 'Y học chính xác thế hệ mới kết hợp công nghệ vật liệu nano, miễn dịch học và sinh học phân tử.'
    },
    finalCode: {
      code: 'NANOBOT-MED-11',
      hint: 'Mật mã hạt nano trị liệu: NANOBOT-MED-11',
      systemChecksum: '0x11B8E2'
    },
    active: true
  },

  {
    id: 'pkg-12',
    packageNumber: 12,
    title: 'Mô Hình Hóa AlphaFold & Gập Cuộn Protein AI',
    codeName: 'PROTEIN-FOLD-12',
    theme: 'Tin Sinh Học & Trí Tuệ Nhân Tạo',
    description: 'Dự đoán cấu trúc không gian 3D của chuỗi polypeptide từ trình tự axit amin bậc 1 bằng mạng nơ-ron Evoformer.',
    aiScan: {
      title: 'Quét Góc Xoay Liên Kết Peptide Phi (φ) và Psi (ψ)',
      core: 'ai_tech',
      prompt: 'Hệ thống AI đang quét biểu đồ Ramachandran của protein. Hãy xác định vùng góc xoay (φ, ψ) tạo thành cấu trúc bậc 2 Xoắn Alpha (Alpha-Helix) bền vững nhất.',
      systemTelemetry: 'Mô hình AI: Evoformer 48 lớp | Số axit amin: 350 aa | Điểm tin cậy pLDDT: 94.5%',
      scanTargets: [
        { id: 'scan-1', label: 'Vùng Xoắn Alpha Phải (φ ≈ -60°, ψ ≈ -45°)', value: 'H-bond đều đặn', isAnomaly: true, frequency: 'Liên kết Hydro i+4', wavelength: '0.54 nm', description: 'Cấu trúc xoắn Alpha cực kỳ bền vững!' },
        { id: 'scan-2', label: 'Vùng Phiến Gấp Nếp Beta (φ ≈ -120°, ψ ≈ +120°)', value: 'Dải Beta', isAnomaly: false, frequency: 'Mạch song song', description: 'Cấu trúc phiến Beta phẳng' },
        { id: 'scan-3', label: 'Vùng Cấm Vướng Lập Thể (Steric Clash)', value: 'Năng lượng cực đại', isAnomaly: false, frequency: 'Va chạm Van der Waals', description: 'Không thể tồn tại trong tự nhiên' },
        { id: 'scan-4', label: 'Vùng Cuộn Ngẫu Nhiên (Random Coil)', value: 'Linh động cao', isAnomaly: false, frequency: 'Không có liên kết H định hình', description: 'Đoạn nối linh hoạt' }
      ],
      correctTargetId: 'scan-1',
      explanation: 'Biểu đồ Ramachandran chứng minh vùng góc nhị diện φ ≈ -60° và ψ ≈ -45° cho phép tạo liên kết hydro nội tại giữa nhóm C=O của axit amin thứ i với nhóm N-H của axit amin thứ i+4 hình thành xoắn alpha chuẩn.',
      visualGraphic: 'neural_circuit'
    },
    aiErrorDetector: {
      title: 'Phát Hiện Sai Sót Về Cầu Nối Disunfua Trong Cấu Trúc Bậc 3',
      core: 'chemistry',
      simulationTopic: 'Liên Kết Hóa Học Ổn Định Cấu Trúc Không Gian Protein',
      aiSimulationText: 'AI Tin sinh học viết: "Cầu nối Disunfua (-S-S-) liên kết đồng hóa trị bền vững được tạo thành từ phản ứng giữa hai gốc axit amin Glycine."',
      bugDescription: 'Glycine (C₂H₅NO₂) không chứa nguyên tử Lưu huỳnh (S); chỉ có Cysteine mới tạo được cầu Disulfua.',
      options: [
        { id: 'opt-1', text: 'Sai axit amin: Chỉ có gốc Cysteine (chứa nhóm thiol -SH) mới có khả năng oxy hóa tạo thành cầu nối Disunfua (-S-S-); Glycine không có lưu huỳnh.', isFlaw: true },
        { id: 'opt-2', text: 'Cầu Disunfua không phải liên kết cộng hóa trị.', isFlaw: false },
        { id: 'opt-3', text: 'Protein không bao giờ có cấu trúc bậc 3.', isFlaw: false },
        { id: 'opt-4', text: 'Cysteine chỉ có trong tế bào thực vật.', isFlaw: false }
      ],
      correctOptionId: 'opt-1',
      patchExplanation: 'Hai nhóm -SH của 2 gốc Cysteine nằm gần nhau trong không gian bị oxy hóa tạo thành cầu liên kết cộng hóa trị -S-S-, đóng vai trò then chốt cố định cấu trúc bậc 3 và bậc 4 của protein.'
    },
    scienceCrossover: {
      title: 'Nghịch Lý Levinthal & Khả Năng Tính Toán Song Song AI',
      coresInvolved: ['ai_tech', 'physics'],
      scenario: 'Nghịch lý Levinthal chỉ ra rằng một protein 100 axit amin có tới 10¹⁰⁰ cấu hình khả dĩ, nếu thử ngẫu nhiên cần nhiều tỷ năm để tìm trạng thái bền nhất, nhưng tế bào chỉ mất vài mili giây.',
      scientificDilemma: 'Mô hình AI AlphaFold giải quyết bài toán này dựa trên nguyên lý tối thiểu hóa đại lượng nhiệt động lực học nào?',
      options: [
        { id: 'opt-1', text: 'Năng lượng tự do Gibbs (Gibbs Free Energy G): Trạng thái gập cuộn tự nhiên (Native State) luôn nằm ở cực tiểu năng lượng tự do sâu nhất.', reasoning: 'Nhiệt động học phân tử chính xác' },
        { id: 'opt-2', text: 'Khối lượng nguyên tử của protein.', reasoning: 'Khối lượng không đổi' },
        { id: 'opt-3', text: 'Vận tốc chuyển động Brown ngẫu nhiên.', reasoning: 'Sai' },
        { id: 'opt-4', text: 'Số lượng nơtron trong nhân nguyên tử.', reasoning: 'Sai' }
      ],
      correctOptionId: 'opt-1',
      explanation: 'Theo nguyên lý nhiệt động học của Anfinsen, cấu trúc tự nhiên của protein là trạng thái có năng lượng tự do Gibbs cực tiểu (global minimum), thuận lợi nhất về mặt nhiệt động lực học.'
    },
    aiDataLab: {
      title: 'Độ Tin Cậy Từng Axit Amin Qua Điểm Số pLDDT Của AlphaFold',
      core: 'ai_tech',
      datasetName: 'Điểm số chất lượng mô hình pLDDT (0 - 100)',
      chartType: 'neural_loss',
      dataPoints: [
        { x: 'Miền N-terminal', y: 45.0, label: 'Kém tin cậy' },
        { x: 'Lõi Hoạt tính 1', y: 92.5, label: 'Rất cao (>90)' },
        { x: 'Xoắn Alpha trung tâm', y: 96.0, label: 'Rất cao (>90)' },
        { x: 'Vòng Loop linh hoạt', y: 62.0, label: 'Trung bình' },
        { x: 'Đầu C-terminal', y: 55.0, label: 'Thấp' }
      ],
      question: 'Điểm pLDDT > 90 được cộng đồng khoa học đánh giá là tương đương với độ phân giải thực nghiệm nhiễu xạ tia X (X-ray). Có bao nhiêu miền trong chuỗi đạt tiêu chuẩn vàng pLDDT > 90?',
      inputUnit: 'miền',
      options: [
        { id: 'opt-1', text: '2 miền (Lõi Hoạt tính 1 và Xoắn Alpha trung tâm)' },
        { id: 'opt-2', text: '4 miền' },
        { id: 'opt-3', text: 'Tất cả các miền' },
        { id: 'opt-4', text: '0 miền' }
      ],
      correctOptionId: 'opt-1',
      numericalTarget: 2,
      numericalTolerance: 0,
      explanation: 'Chỉ có Lõi hoạt tính 1 (92.5) và Xoắn Alpha trung tâm (96.0) có pLDDT > 90, đảm bảo độ chính xác cấp độ nguyên tử.'
    },
    keywordPuzzle: {
      type: 'science_connection',
      title: 'Bốn Cấp Độ Cấu Trúc Không Gian Của Protein',
      instruction: 'Nối các bậc cấu trúc protein với đặc điểm tương ứng.',
      keysUsed: ['KHOA HỌC', 'SÁNG TẠO', 'CHINH PHỤC'],
      connectionPairs: [
        { id: 'pf-1', left: 'Cấu trúc Bậc 1', right: 'Trình tự các axit amin liên kết bởi liên kết peptide', category: 'Structure' },
        { id: 'pf-2', left: 'Cấu trúc Bậc 2', right: 'Xoắn Alpha và Phiến Beta định hình bởi liên kết Hydro', category: 'Structure' },
        { id: 'pf-3', left: 'Cấu trúc Bậc 3', right: 'Cấu hình không gian 3D toàn vẹn của chuỗi đơn polypeptide', category: 'Structure' },
        { id: 'pf-4', left: 'Cấu trúc Bậc 4', right: 'Tổ hợp của nhiều chuỗi polypeptide (như Hemoglobin)', category: 'Structure' }
      ],
      finalKeyword: 'NEXT GEN',
      explanation: 'Sự hoàn thiện cấu trúc không gian 3D quyết định tính đặc hiệu chức năng sinh học của mọi protein enzyme trong cơ thể.'
    },
    finalCode: {
      code: 'PROTEIN-FOLD-12',
      hint: 'Mật mã cấu trúc sinh học AI: PROTEIN-FOLD-12',
      systemChecksum: '0x12E9F7'
    },
    active: true
  },

  {
    id: 'pkg-13',
    packageNumber: 13,
    title: 'Siêu Tụ Điện Graphene & Pin Lithium-Khí',
    codeName: 'GRAPHENE-BATT-13',
    theme: 'Khoa Học Vật Liệu & Hóa Học Điện Hóa',
    description: 'Vật liệu carbon 2D đơn lớp Graphene với diện tích bề mặt riêng 2630 m²/g lưu trữ năng lượng siêu nhanh.',
    aiScan: {
      title: 'Quét Cấu Trúc Mạng Tổ Ong Hai Chiều Của Graphene',
      core: 'chemistry',
      prompt: 'Kính hiển vi quét xuyên hầm STM đang quét màng Graphene. Hãy xác định trạng thái lai hóa của nguyên tử Carbon trong mạng tinh thể lục giác 2D.',
      systemTelemetry: 'Độ dày màng: 0.335 nm (1 lớp nguyên tử) | Độ bền kéo: 130 GPa | Độ dẫn nhiệt: 5000 W/mK',
      scanTargets: [
        { id: 'scan-1', label: 'Lai hóa sp³ (Hình tứ diện đều)', value: 'Kim cương', isAnomaly: false, frequency: 'Chất cách điện', description: 'Cấu trúc kim cương 3D' },
        { id: 'scan-2', label: 'Lai hóa sp² (Mạng phẳng lục giác tổ ong)', value: 'Graphene đơn lớp', isAnomaly: true, frequency: 'Electron Dirac di chuyển tự do', wavelength: '0.142 nm', description: 'Độ dẫn điện siêu việt không điện trở tán xạ!' },
        { id: 'scan-3', label: 'Lai hóa sp (Mạch thẳng nối ba)', value: 'Carbyne', isAnomaly: false, frequency: 'Kém bền', description: 'Mạch 1D' },
        { id: 'scan-4', label: 'Carbon vô định hình', value: 'Muội than', isAnomaly: false, frequency: 'Dẫn điện kém', description: 'Cấu trúc hỗn loạn' }
      ],
      correctTargetId: 'scan-2',
      explanation: 'Trong Graphene, mỗi nguyên tử carbon lai hóa sp² liên kết với 3 nguyên tử carbon lân cận bằng liên kết sigma góc 120° trên mặt phẳng, còn orbital pz còn lại tạo hệ liên kết pi giải tỏa cho phép electron tự do chuyển động với vận tốc 1/300 vận tốc ánh sáng.',
      visualGraphic: 'chemical_bonds'
    },
    aiErrorDetector: {
      title: 'Phát Hiện Sai Sót Về Sự Hình Thành Nhánh Gai Dendrite Trong Pin Lithium',
      core: 'chemistry',
      simulationTopic: 'Cơ Chế Suy Thoái Và Đoản Mạch Trong Pin Ion Lithium',
      aiSimulationText: 'AI Pin dự báo: "Hiện tượng chập cháy pin Lithium xảy ra do nguyên tử Oxy ngưng tụ thành kim loại rắn đâm xuyên qua màng ngăn cách điện."',
      bugDescription: 'Gai đoản mạch là do kim loại Lithium kết tinh nhánh (Dendrite), không thể là khí Oxy.',
      options: [
        { id: 'opt-1', text: 'Sai chất tạo nhánh: Các sợi gai nhánh (Lithium Dendrite) được hình thành do kim loại Lithium mạ không đều trên cực âm trong quá trình sạc nhanh, đâm thủng màng ngăn gây đoản mạch.', isFlaw: true },
        { id: 'opt-2', text: 'Pin lithium không dùng màng ngăn cách điện.', isFlaw: false },
        { id: 'opt-3', text: 'Oxy là kim loại nặng.', isFlaw: false },
        { id: 'opt-4', text: 'Pin lithium không bao giờ bị cháy nổ.', isFlaw: false }
      ],
      correctOptionId: 'opt-1',
      patchExplanation: 'Khi sạc pin quá nhanh hoặc nhiệt độ thấp, ion Li⁺ không kịp xen kẽ vào các lớp than chì mà bị khử kết tinh thành các nhánh gai kim loại Lithium (dendrites) sắc nhọn đâm thủng màng phân cách gây đoản mạch và thoát nhiệt.'
    },
    scienceCrossover: {
      title: 'Điện Dung Siêu Tụ Điện Lượng Tử & Lớp Kép Điện Học (EDLC)',
      coresInvolved: ['chemistry', 'physics'],
      scenario: 'Siêu tụ điện tích trữ điện tích dựa trên cơ chế lớp kép điện học (Electric Double Layer) tại ranh giới điện cực graphene và dung dịch điện phân.',
      scientificDilemma: 'Công thức tính điện dung của tụ điện phẳng C = (ε.ε₀.S) / d cho thấy yếu tố nào của Graphene tạo nên điện dung khổng lồ?',
      options: [
        { id: 'opt-1', text: 'Diện tích bề mặt riêng S cực đại (2630 m²/g) và khoảng cách d lớp kép phân tử siêu nhỏ cỡ nanomet.', reasoning: 'Vật lí tĩnh điện chính xác' },
        { id: 'opt-2', text: 'Khối lượng riêng của graphene rất nặng.', reasoning: 'Graphene rất nhẹ' },
        { id: 'opt-3', text: 'Khoảng cách hai bản tụ xa hàng kilomet.', reasoning: 'Khoảng cách xa làm C giảm' },
        { id: 'opt-4', text: 'Dùng từ trường thay thế điện tích.', reasoning: 'Sai' }
      ],
      correctOptionId: 'opt-1',
      explanation: 'Điện dung C tỉ lệ thuận với diện tích bề mặt S và tỉ lệ nghịch với khoảng cách bản d. Graphene có diện tích tiếp xúc khổng lồ và khoảng cách lớp kép ion chỉ vài nanomet, tạo điện dung siêu tụ gấp hàng triệu lần tụ thường.'
    },
    aiDataLab: {
      title: 'Đồ Thị Phóng - Nạp Dòng Không Đổi (GCD) Của Siêu Tụ',
      core: 'chemistry',
      datasetName: 'Điện áp (V) theo thời gian phóng nạp (giây)',
      chartType: 'titration',
      dataPoints: [
        { x: '0s (Bắt đầu sạc)', y: 0.0, label: '0V' },
        { x: '10s (Sạc đầy)', y: 2.7, label: 'V_max' },
        { x: '10.1s (Bắt đầu phóng)', y: 2.65, label: 'Độ sụt IR drop' },
        { x: '20s (Xả hết)', y: 0.0, label: '0V' }
      ],
      question: 'Siêu tụ nạp đầy từ 0V lên 2.7V chỉ trong đúng 10 giây với dòng I = 5A. Tính điện dung tương đương C theo công thức C = (I × Δt) / ΔV?',
      inputUnit: 'Farad (F)',
      options: [
        { id: 'opt-1', text: 'C = (5A × 10s) / 2.7V ≈ 18.52 Farad' },
        { id: 'opt-2', text: 'C = 50.0 Farad' },
        { id: 'opt-3', text: 'C = 0.54 Farad' },
        { id: 'opt-4', text: 'C = 135 Farad' }
      ],
      correctOptionId: 'opt-1',
      numericalTarget: 18.52,
      numericalTolerance: 0.2,
      explanation: 'Áp dụng công thức C = q / V = (I * Δt) / ΔV = (5 * 10) / 2.7 ≈ 18.52 Farad.'
    },
    keywordPuzzle: {
      type: 'science_connection',
      title: 'Các Vật Liệu Nano Tiên Tiến Thế Hệ Mới',
      instruction: 'Nối tên các thù hình và vật liệu nano với ứng dụng nổi bật.',
      keysUsed: ['KHOA HỌC', 'SÁNG TẠO', 'CHINH PHỤC'],
      connectionPairs: [
        { id: 'm-1', left: 'Graphene (2D Carbon)', right: 'Siêu tụ điện sạc nhanh & màn hình dẻo trong suốt', category: 'Nano' },
        { id: 'm-2', left: 'Ống Nano Carbon (CNT 1D)', right: 'Vật liệu gia cường cơ học độ bền kéo gấp 100 lần thép', category: 'Nano' },
        { id: 'm-3', left: 'Fullerene C60 (0D Buckyball)', right: 'Chất bẫy gốc tự do chống lão hóa & dẫn truyền dược phẩm', category: 'Nano' },
        { id: 'm-4', left: 'Vật Liệu Khung Kim Loại Hữu Cơ (MOF)', right: 'Bẫy khí carbon và thu gom nước từ không khí sa mạc', category: 'Porous' }
      ],
      finalKeyword: 'NEXT GEN',
      explanation: 'Sự kỳ diệu của cấu trúc nano biến đổi các đặc tính lượng tử, cơ học và quang điện của vật liệu.'
    },
    finalCode: {
      code: 'GRAPHENE-BATT-13',
      hint: 'Mật mã vật liệu lưu trữ năng lượng: GRAPHENE-BATT-13',
      systemChecksum: '0x13F2C1'
    },
    active: true
  },

  {
    id: 'pkg-14',
    packageNumber: 14,
    title: 'Hệ Sinh Thái Khép Kín Trạm Không Gian Biosphere',
    codeName: 'ECO-ORBIT-14',
    theme: 'Sinh Thái Học & Kỹ Thuật Sinh Tồn Vũ Trụ',
    description: 'Vận hành hệ thống tái sinh sinh học khép kín cung cấp 100% oxy, nước và thực phẩm cho phi hành gia trên Trạm Sao Hỏa.',
    aiScan: {
      title: 'Quét Năng Suất Sinh Học Sơ Cấp Thuần (NPP)',
      core: 'biology',
      prompt: 'Hệ thống thủy canh tự động đang đo lường năng suất quang hợp. Hãy chọn sinh vật quang dưỡng có tốc độ cố định CO₂ và tạo sinh khối nhanh nhất trong buồng nuôi.',
      systemTelemetry: 'Ánh sáng LED chuyên dụng: 660nm/450nm | Nồng độ O₂: 21.0% | Độ ẩm tương đối: 65%',
      scanTargets: [
        { id: 'scan-1', label: 'Tảo Đơn Bào Chlorella pyrenoidosa', value: 'NPP = 25 g/m² ngày', isAnomaly: true, frequency: 'Hiệu suất quang năng 8%', wavelength: 'Tảo quang hợp siêu tốc', description: 'Tái sinh oxy và cung cấp nguồn protein hoàn chỉnh!' },
        { id: 'scan-2', label: 'Cây lúa mạch', value: 'NPP = 8 g/m² ngày', isAnomaly: false, frequency: 'Chu kỳ dài', description: 'Cần nhiều thời gian sinh trưởng' },
        { id: 'scan-3', label: 'Nấm men Saccharomyces', value: 'Hô hấp dị dưỡng', isAnomaly: false, frequency: 'Tiêu thụ oxy', description: 'Không sinh ra oxy' },
        { id: 'scan-4', label: 'Vi khuẩn phân hủy kỵ khí', value: 'Sinh khí Metan', isAnomaly: false, frequency: 'Xử lý chất thải', description: 'Cần kiểm soát nồng độ CH₄' }
      ],
      correctTargetId: 'scan-1',
      explanation: 'Vi tảo Chlorella có tốc độ sinh trưởng nhân đôi chỉ trong 24 giờ, sử dụng hiệu quả hơn 8% năng lượng ánh sáng và giải phóng thể tích khí O₂ lớn gấp nhiều lần diện tích bề mặt nó chiếm chỗ.',
      visualGraphic: 'dna_helix'
    },
    aiErrorDetector: {
      title: 'Phát Hiện Sai Sót Về Chu Trình Nitơ Trong Hệ Kín',
      core: 'biology',
      simulationTopic: 'Chu Trình Nitơ Và Vai Trò Của Vi Khuẩn Đất',
      aiSimulationText: 'AI Môi trường mô tả: "Cây trồng có thể hấp thụ trực tiếp khí Nitơ phân tử (N₂) trong khí quyển qua khí khổng để tổng hợp axit amin mà không cần vi khuẩn cố định đạm hay khoáng hóa."',
      bugDescription: 'Thực vật bậc cao hoàn toàn không có enzyme Nitrogenase để bẻ gãy liên kết ba N≡N bền vững của khí N₂.',
      options: [
        { id: 'opt-1', text: 'Sai sinh lí thực vật: Thực vật không thể hấp thụ N₂ tự do; bắt buộc phải nhờ vi sinh vật cố định đạm chuyển hóa thành ion NH₄⁺ hoặc NO₃⁻ cây mới hút được qua rễ.', isFlaw: true },
        { id: 'opt-2', text: 'Khí nitơ không tồn tại trong không khí.', isFlaw: false },
        { id: 'opt-3', text: 'Thực vật không cần nitơ để sống.', isFlaw: false },
        { id: 'opt-4', text: 'Axit amin không chứa nguyên tử nitơ.', isFlaw: false }
      ],
      correctOptionId: 'opt-1',
      patchExplanation: 'Liên kết ba N≡N cực kỳ bền (năng lượng liên kết 945 kJ/mol). Chỉ có enzyme nitrogenase ở các vi khuẩn cố định đạm (như Rhizobium, vi khuẩn lam) mới có khả năng cố định N₂ thành dạng đạm hòa tan.'
    },
    scienceCrossover: {
      title: 'Thẩm Thấu Ngược RO & Áp Suất Thẩm Thấu Nước Thải Vũ Trụ',
      coresInvolved: ['chemistry', 'physics'],
      scenario: 'Để tái chế 98% nước tiểu và mồ hôi phi hành gia thành nước uống siêu tinh khiết, hệ thống sử dụng màng thẩm thấu ngược (Reverse Osmosis).',
      scientificDilemma: 'Áp suất cơ học tác động lên phía dung dịch đậm đặc phải thỏa mãn điều kiện gì để ép dòng nước chảy ngược tự nhiên qua màng bán thấm?',
      options: [
        { id: 'opt-1', text: 'Áp suất nén P_áp đặt phải lớn hơn áp suất thẩm thấu π của dung dịch (P > π = RTC)', reasoning: 'Nhiệt động học dung dịch chính xác' },
        { id: 'opt-2', text: 'Áp suất nén phải nhỏ hơn áp suất khí quyển.', reasoning: 'Nước sẽ chảy xuôi theo chiều thẩm thấu làm loãng thêm' },
        { id: 'opt-3', text: 'Phải hạ nhiệt độ xuống -50°C để đông đá.', reasoning: 'Sai' },
        { id: 'opt-4', text: 'Chỉ cần dùng nam châm hút ion muối.', reasoning: 'Muối hòa tan không có từ tính mạnh' }
      ],
      correctOptionId: 'opt-1',
      explanation: 'Hiện tượng thẩm thấu tự nhiên đẩy nước từ nơi loãng sang nơi đặc. Muốn đảo ngược quá trình (thẩm thấu ngược RO), ta phải đặt một áp suất cơ học P lớn hơn áp suất thẩm thấu π của dung dịch.'
    },
    aiDataLab: {
      title: 'Cân Bằng Sinh Thái Tỷ Lệ Hô Hấp RQ Của Phi Hành Đoàn',
      core: 'biology',
      datasetName: 'Lượng CO₂ thải ra và O₂ tiêu thụ của 4 phi hành gia',
      chartType: 'kinetics',
      dataPoints: [
        { x: 'Chế độ ăn Giàu Đường (Carb)', y: 1.00, label: 'RQ = 1.00' },
        { x: 'Chế độ ăn Giàu Đạm (Protein)', y: 0.82, label: 'RQ = 0.82' },
        { x: 'Chế độ ăn Giàu Béo (Lipid)', y: 0.70, label: 'RQ = 0.70' },
        { x: 'Chế độ ăn Hỗn hợp thực tế', y: 0.85, label: 'RQ = 0.85' }
      ],
      question: 'Hệ số hô hấp RQ = V_CO₂ / V_O₂. Với chế độ ăn hỗn hợp RQ = 0.85, nếu mỗi phi hành gia tiêu thụ 600 L O₂/ngày thì thể tích khí CO₂ hệ thống lọc cần xử lý cho 1 phi hành gia mỗi ngày là bao nhiêu?',
      inputUnit: 'Lít CO₂',
      options: [
        { id: 'opt-1', text: 'V_CO₂ = 600 L × 0.85 = 510 Lít CO₂/ngày' },
        { id: 'opt-2', text: 'V_CO₂ = 600 Lít CO₂/ngày' },
        { id: 'opt-3', text: 'V_CO₂ = 705 Lít CO₂/ngày' },
        { id: 'opt-4', text: 'V_CO₂ = 300 Lít CO₂/ngày' }
      ],
      correctOptionId: 'opt-1',
      numericalTarget: 510,
      numericalTolerance: 5,
      explanation: 'Theo công thức RQ = V_CO₂ / V_O₂ => V_CO₂ = RQ * V_O₂ = 0.85 * 600 L = 510 Lít CO₂/ngày.'
    },
    keywordPuzzle: {
      type: 'science_connection',
      title: 'Các Mắt Xích Của Hệ Sinh Thái Nhân Tạo Vũ Trụ',
      instruction: 'Nối các thành phần sinh thái với vai trò vận hành trong trạm vũ trụ.',
      keysUsed: ['KHOA HỌC', 'SÁNG TẠO', 'CHINH PHỤC'],
      connectionPairs: [
        { id: 'eco-1', left: 'Sinh vật Sản xuất (Tảo, Cây xanh)', right: 'Chuyển hóa năng lượng mặt trời, hấp thụ CO₂ và sinh O₂', category: 'Ecology' },
        { id: 'eco-2', left: 'Sinh vật Tiêu thụ (Con người)', right: 'Sử dụng O₂ và thực phẩm sinh học, đào thải CO₂ và chất thải', category: 'Ecology' },
        { id: 'eco-3', left: 'Sinh vật Phân giải (Vi sinh vật)', right: 'Khoáng hóa chất thải hữu cơ thành muối khoáng vô cơ cho cây', category: 'Ecology' },
        { id: 'eco-4', left: 'Hệ Thống Tái Sinh Nước (WRS)', right: 'Tái chế nước tiểu và hơi ẩm ngưng tụ thành nước sinh hoạt 100%', category: 'LifeSupport' }
      ],
      finalKeyword: 'NEXT GEN',
      explanation: 'Chu trình vật chất khép kín 100% là điều kiện tiên quyết cho các sứ mệnh thám hiểm không gian dài ngày.'
    },
    finalCode: {
      code: 'ECO-ORBIT-14',
      hint: 'Mật mã sinh thái trạm không gian: ECO-ORBIT-14',
      systemChecksum: '0x14C7A3'
    },
    active: true
  },

  {
    id: 'pkg-15',
    packageNumber: 15,
    title: 'Đài Giao Thoa Sóng Hấp Dẫn LIGO & Hố Đen Nhị Phân',
    codeName: 'LIGO-GRAVITY-15',
    theme: 'Thuyết Tương Đối Rộng & Vật Lí Thiên Văn',
    description: 'Bắt trọn dao động uốn cong không thời gian với độ dịch chuyển gương 1/1000 kích thước hạt proton do hai hố đen va chạm.',
    aiScan: {
      title: 'Quét Vân Giao Thoa Laser Trong Cánh Tay Giao Thoa 4km',
      core: 'physics',
      prompt: 'Giao thoa kế Michelson đang đo độ biến thiên chiều dài cánh tay ΔL/L ~ 10⁻²¹. Hãy phát hiện tín hiệu Chirp của sóng hấp dẫn GW150914.',
      systemTelemetry: 'Công suất laser: 200 W | Độ nhạy chân không: 10⁻⁹ Torr | Khối lượng gương: 40 kg thạch anh siêu tinh khiết',
      scanTargets: [
        { id: 'scan-1', label: 'Nhiễu Địa Chấn Mặt Đất', value: '1 - 10 Hz', isAnomaly: false, frequency: 'Sóng địa chấn', description: 'Đã bị hệ thống lò xo treo 4 tầng triệt tiêu' },
        { id: 'scan-2', label: 'Tín Hiệu Chirp Sáp Nhập Hố Đen', value: '35 Hz tăng vọt lên 250 Hz', isAnomaly: true, frequency: 'ΔL = 10⁻¹⁸ mét', wavelength: 'Sóng hấp dẫn', description: 'Hai hố đen 36 và 29 khối lượng Mặt Trời hợp nhất!' },
        { id: 'scan-3', label: 'Nhiễu Nhiệt Lượng Tử Gương', value: '1000 Hz', isAnomaly: false, frequency: 'Áp suất photon laser', description: 'Nhiễu Poisson đếm hạt photon' },
        { id: 'scan-4', label: 'Sóng Âm Thanh Môi Trường', value: '50 Hz', isAnomaly: false, frequency: 'Điện lưới AC', description: 'Bộ lọc notch filter đã lọc bỏ' }
      ],
      correctTargetId: 'scan-2',
      explanation: 'Khi hai hố đen quay quanh nhau với vận tốc gần bằng ánh sáng rồi hợp nhất, chúng phát ra sóng hấp dẫn với tần số và biên độ tăng vọt theo thời gian (dạng sóng Chirp đặc trưng).',
      visualGraphic: 'particle_collision'
    },
    aiErrorDetector: {
      title: 'Phát Hiện Sai Sót Về Vận Tốc Lan Truyền Sóng Hấp Dẫn',
      core: 'physics',
      simulationTopic: 'Vận Tốc Của Sóng Hấp Dẫn Theo Thuyết Tương Đối Einstein',
      aiSimulationText: 'AI Simulator đưa ra giả thuyết: "Sóng hấp dẫn là sự co dãn của không thời gian nên có khả năng truyền đi tức thời trong toàn vũ trụ mà không bị giới hạn bởi tốc độ ánh sáng c."',
      bugDescription: 'Thuyết tương đối rộng khẳng định sóng hấp dẫn lan truyền chính xác bằng tốc độ ánh sáng trong chân không.',
      options: [
        { id: 'opt-1', text: 'Sai vận tốc: Sóng hấp dẫn lan truyền với vận tốc hữu hạn chính xác bằng vận tốc ánh sáng c (300,000 km/s), đã được kiểm chứng qua sự kiện va chạm sao neutron GW170817.', isFlaw: true },
        { id: 'opt-2', text: 'Sóng hấp dẫn chỉ truyền được trong chất rắn.', isFlaw: false },
        { id: 'opt-3', text: 'Hố đen không có lực hấp dẫn.', isFlaw: false },
        { id: 'opt-4', text: 'Giao thoa kế chỉ đo được nhiệt độ chứ không đo được khoảng cách.', isFlaw: false }
      ],
      correctOptionId: 'opt-1',
      patchExplanation: 'Sự kiện đa sứ giả GW170817 (ghi nhận đồng thời sóng hấp dẫn và chớp tia gamma sau 1.7 giây từ khoảng cách 130 triệu năm ánh sáng) đã xác nhận tốc độ sóng hấp dẫn bằng tốc độ ánh sáng với sai số dưới 10⁻¹⁵.'
    },
    scienceCrossover: {
      title: 'Nén Ánh Sáng Lượng Tử (Quantum Squeezed Light) & Giới Hạn Chuẩn',
      coresInvolved: ['physics', 'ai_tech'],
      scenario: 'Để vượt qua giới hạn nhiễu lượng tử chuẩn (Standard Quantum Limit), LIGO bơm chùm ánh sáng nén lượng tử (Squeezed Light) vào cổng giao thoa.',
      scientificDilemma: 'Ánh sáng nén giảm độ bất định của pha dao động Δφ để tăng độ nhạy thì đại lượng liên hợp nào sẽ tăng độ bất định theo hệ thức Heisenberg?',
      options: [
        { id: 'opt-1', text: 'Độ bất định về biên độ cường độ photon ΔN tăng lên (ΔN.Δφ ≥ 1/2)', reasoning: 'Quang học lượng tử chính xác' },
        { id: 'opt-2', text: 'Khối lượng của gương thạch anh tăng gấp đôi.', reasoning: 'Sai' },
        { id: 'opt-3', text: 'Tần số laser giảm về 0.', reasoning: 'Sai' },
        { id: 'opt-4', text: 'Áp suất khí quyển trong buồng tăng vọt.', reasoning: 'Sai' }
      ],
      correctOptionId: 'opt-1',
      explanation: 'Theo nguyên lý bất định lượng tử đối với photon, tích độ bất định giữa số lượng hạt photon ΔN và pha sóng Δφ bị ràng buộc ΔN.Δφ ≥ 1/2. Khi nén pha (giảm Δφ để đo chính xác vị trí gương), độ bất định về biên độ ΔN sẽ tăng lên tương ứng.'
    },
    aiDataLab: {
      title: 'Tính Năng Lượng Chuyển Hóa Thành Sóng Hấp Dẫn Theo E = mc²',
      core: 'physics',
      datasetName: 'Khối lượng hố đen trước và sau hợp nhất (đơn vị Khối lượng Mặt trời M_☉)',
      chartType: 'spectrum',
      dataPoints: [
        { x: 'Hố đen 1 (M₁)', y: 36.0, label: 'M_☉' },
        { x: 'Hố đen 2 (M₂)', y: 29.0, label: 'M_☉' },
        { x: 'Tổng khối lượng ban đầu', y: 65.0, label: 'M_☉' },
        { x: 'Hố đen tàn tích (M_final)', y: 62.0, label: 'M_☉' }
      ],
      question: 'Khối lượng bị hao hụt ΔM = (36 + 29) - 62 = 3.0 M_☉ (gấp 3 lần khối lượng Mặt Trời!) đã chuyển hóa hoàn toàn thành năng lượng sóng hấp dẫn trong 0.2 giây. Công suất phát sóng cực đại tương đương bao nhiêu Joules?',
      inputUnit: 'Joules',
      options: [
        { id: 'opt-1', text: 'E = 3.0 × 2×10³⁰ kg × (3×10⁸)² ≈ 5.4 × 10⁴⁷ Joules (lớn hơn toàn bộ ánh sáng các ngôi sao trong vũ trụ quan sát được cộng lại!)' },
        { id: 'opt-2', text: 'E = 1.0 × 10¹² Joules' },
        { id: 'opt-3', text: 'E = 0 Joules' },
        { id: 'opt-4', text: 'E = 3.0 Joules' }
      ],
      correctOptionId: 'opt-1',
      numericalTarget: 5.4e47,
      numericalTolerance: 1e46,
      explanation: 'ΔM = 3.0 M_☉ = 3 * 1.989×10³⁰ kg ≈ 6×10³⁰ kg. Năng lượng E = ΔM.c² = 6×10³⁰ * (3×10⁸)² = 5.4×10⁴⁷ Joules.'
    },
    keywordPuzzle: {
      type: 'sort',
      title: 'Quá Trình Tiến Hóa Và Kết Thúc Của Ngôi Sao Nặng',
      instruction: 'Sắp xếp các giai đoạn vòng đời của một ngôi sao khối lượng lớn (> 20 M_☉).',
      keysUsed: ['KHOA HỌC', 'SÁNG TẠO', 'CHINH PHỤC'],
      sortItems: [
        { id: 'gw-1', text: 'Đốt cháy Hydro trong lõi tại nhánh chính (Main Sequence)', correctOrder: 1 },
        { id: 'gw-2', text: 'Giãn nở thành Siêu sao Đỏ tổng hợp Silic thành Sắt trong lõi', correctOrder: 2 },
        { id: 'gw-3', text: 'Lõi sụp đổ hấp dẫn kích hoạt vụ nổ Siêu tân tinh (Supernova)', correctOrder: 3 },
        { id: 'gw-4', text: 'Tàn tích sụp đổ hoàn toàn tạo thành Hố đen kỳ dị (Black Hole)', correctOrder: 4 }
      ],
      finalKeyword: 'NEXT GEN',
      explanation: 'Sự tiến hóa của sao nặng kết thúc bằng vụ nổ siêu tân tinh giải phóng các nguyên tố nặng vào vũ trụ và để lại hố đen hoặc sao neutron.'
    },
    finalCode: {
      code: 'LIGO-GRAVITY-15',
      hint: 'Mật mã sóng không thời gian: LIGO-GRAVITY-15',
      systemChecksum: '0x15F8C4'
    },
    active: true
  },

  {
    id: 'pkg-16',
    packageNumber: 16,
    title: 'Miễn Dịch Trị Liệu & Kháng Thể Đơn Dòng Bispecific',
    codeName: 'IMMUNO-CORE-16',
    theme: 'Miễn Dịch Học Hiện Đại & Công Nghệ Sinh Học Tương Lai',
    description: 'Thiết kế kháng thể đặc hiệu kép kết nối trực tiếp tế bào T sát thủ với tế bào ung thư để kích hoạt cơ chế tự hủy apoptosis.',
    aiScan: {
      title: 'Quét Kháng Nguyên CD3 Trên Tế Bào T & CD19 Trên Tế Bào B Ác Tính',
      core: 'biology',
      prompt: 'Kháng thể đặc hiệu kép Bispecific T-cell Engager (BiTE) có 2 đầu nối. Hãy quét đầu gắn CD3 định vị tế bào T và đầu gắn CD19 định vị tế bào lympho ung thư.',
      systemTelemetry: 'Hằng số ái lực liên kết Kd: 1.5 nM | Trọng lượng phân tử: 55 kDa | Thời gian bán thải: 2.1 giờ',
      scanTargets: [
        { id: 'scan-1', label: 'Kháng thể Đơn chức thông thường', value: '1 vị trí gắn', isAnomaly: false, frequency: 'Hiệu quả chậm', description: 'Cần tế bào trình diện kháng nguyên phụ trợ' },
        { id: 'scan-2', label: 'Cụm Nối Kép BiTE (CD3-CD19)', value: 'Cầu nối liên hợp phân tử', isAnomaly: true, frequency: 'Ái lực cao gấp 100 lần', wavelength: '55 kDa', description: 'Kéo tế bào T sát thủ áp sát ép tế bào ung thư vào ngõ cụt!' },
        { id: 'scan-3', label: 'Phức hợp protein huyết tương Albumin', value: '66 kDa', isAnomaly: false, frequency: 'Vận chuyển chất', description: 'Không có hoạt tính miễn dịch đặc hiệu' },
        { id: 'scan-4', label: 'Kháng nguyên HLA không tương thích', value: 'Gây thải ghép', isAnomaly: false, frequency: 'Bị loại bỏ', description: 'Không phù hợp người nhận' }
      ],
      correctTargetId: 'scan-2',
      explanation: 'Kháng thể BiTE là phát minh đột phá: một đầu túm lấy thụ thể CD3 trên tế bào T sát thủ, đầu kia túm lấy CD19 trên tế bào u, kéo hai tế bào áp sát nhau kích hoạt độc tế bào tiêu diệt khối u mà không cần qua bước trình diện kháng nguyên phức tạp.',
      visualGraphic: 'dna_helix'
    },
    aiErrorDetector: {
      title: 'Phát Hiện Sai Sót Về Cơ Chế Tiết Perforin Và Granzyme',
      core: 'biology',
      simulationTopic: 'Cơ Chế Tiêu Diệt Tế Bào Đích Của Tế Bào T Độc (CTL)',
      aiSimulationText: 'AI Miễn dịch mô tả: "Tế bào T tiêu diệt tế bào ung thư bằng cách bơm đầy nước làm tế bào vỡ ra do áp suất thẩm thấu mà không cần bất kỳ enzyme phân giải nào."',
      bugDescription: 'Tế bào T tiết ra các hạt protein độc tế bào chuyên biệt là Perforin (đục lỗ màng) và Granzyme B (kích hoạt caspase gây tự hủy).',
      options: [
        { id: 'opt-1', text: 'Sai cơ chế: Tế bào T giải phóng Perforin đục lỗ thủng trên màng tế bào đích, sau đó Granzyme B chui qua lỗ vào trong kích hoạt chuỗi enzyme Caspase gây chết tế bào theo chương trình (Apoptosis).', isFlaw: true },
        { id: 'opt-2', text: 'Tế bào T không thể tiêu diệt tế bào ung thư.', isFlaw: false },
        { id: 'opt-3', text: 'Tế bào ung thư không bị tác động bởi protein.', isFlaw: false },
        { id: 'opt-4', text: 'Perforin là chất béo không có trong cơ thể.', isFlaw: false }
      ],
      correctOptionId: 'opt-1',
      patchExplanation: 'Perforin tạo lỗ thủng xuyên màng hình ống trên màng sinh chất tế bào đích, cho phép serine protease Granzyme xâm nhập phân cắt protein và kích hoạt con đường tự hủy tế bào (Apoptosis) một cách sạch sẽ.'
    },
    scienceCrossover: {
      title: 'Cơn Bão Cytokine (CRS) & Cân Bằng Nồng Độ Phân Tử Kháng Viêm',
      coresInvolved: ['biology', 'chemistry'],
      scenario: 'Khi hàng triệu tế bào T cùng kích hoạt, lượng cytokine IL-6 tăng vọt gây hội chứng phóng thích cytokine (CRS).',
      scientificDilemma: 'Kháng thể đối kháng Tocilizumab được dùng để ngăn chặn cơn bão cytokine bằng cách khóa chặn cấu trúc nào?',
      options: [
        { id: 'opt-1', text: 'Gắn cạnh tranh và phong tỏa thụ thể IL-6R (Interleukin-6 Receptor), ngăn không cho tín hiệu viêm truyền vào tế bào.', reasoning: 'Dược lý học miễn dịch chính xác' },
        { id: 'opt-2', text: 'Làm đông tụ toàn bộ máu của bệnh nhân.', reasoning: 'Gây tử vong' },
        { id: 'opt-3', text: 'Tiêu diệt toàn bộ tế bào gốc tủy xương.', reasoning: 'Sai' },
        { id: 'opt-4', text: 'Hòa tan xương người bệnh.', reasoning: 'Vô lý' }
      ],
      correctOptionId: 'opt-1',
      explanation: 'Tocilizumab là kháng thể đơn dòng nhân hóa tái tổ hợp nhắm vào thụ thể IL-6R (cả dạng hòa tan và dạng gắn màng), cắt đứt đường truyền tín hiệu viêm giúp dập tắt cơn bão cytokine cứu sống bệnh nhân.'
    },
    aiDataLab: {
      title: 'Động Học Phân Rã Khối U Theo Chu Kỳ Bán Hủy Dược Chất',
      core: 'biology',
      datasetName: 'Số lượng tế bào ung thư còn sót lại (triệu tế bào) theo tuần điều trị',
      chartType: 'decay',
      dataPoints: [
        { x: 'Tuần 0', y: 1000, label: 'Khối u ban đầu' },
        { x: 'Tuần 1', y: 250, label: 'Giảm 75%' },
        { x: 'Tuần 2', y: 62.5, label: 'Giảm 93.75%' },
        { x: 'Tuần 3', y: 15.6, label: 'Giảm 98.4%' },
        { x: 'Tuần 4', y: 0.1, label: 'Thuyên giảm hoàn toàn' }
      ],
      question: 'Sau mỗi tuần điều trị bằng kháng thể BiTE, số lượng tế bào ung thư giảm đi 4 lần (tương đương giảm 75%). Hiệu suất tiêu diệt tế bào ung thư sau 3 tuần điều trị đạt bao nhiêu phần trăm?',
      inputUnit: '%',
      options: [
        { id: 'opt-1', text: '98.44% (từ 1000 triệu giảm xuống còn 15.6 triệu tế bào)' },
        { id: 'opt-2', text: '75.00%' },
        { id: 'opt-3', text: '50.00%' },
        { id: 'opt-4', text: '100%' }
      ],
      correctOptionId: 'opt-1',
      numericalTarget: 98.44,
      numericalTolerance: 0.5,
      explanation: 'Tỷ lệ sống sót sau 3 tuần: (1/4)³ = 1/64 ≈ 1.5625%. Tỷ lệ bị tiêu diệt = 100% - 1.5625% = 98.4375% ≈ 98.44%.'
    },
    keywordPuzzle: {
      type: 'science_connection',
      title: 'Vũ Khí Miễn Dịch Học Tân Tiến',
      instruction: 'Nối các thành phần miễn dịch với vai trò tiêu diệt mầm bệnh.',
      keysUsed: ['KHOA HỌC', 'SÁNG TẠO', 'CHINH PHỤC'],
      connectionPairs: [
        { id: 'im-1', left: 'Kháng thể IgG', right: 'Kháng thể phổ biến nhất trong huyết thanh, trung hòa độc tố', category: 'Immunoglobulin' },
        { id: 'im-2', left: 'Tế bào T Hỗ trợ (CD4⁺ Th)', right: 'Nhạc trưởng điều phối và tiết cytokine kích hoạt các tế bào khác', category: 'Lymphocyte' },
        { id: 'im-3', left: 'Tế bào Diệt Tự nhiên (NK Cell)', right: 'Tiêu diệt tế bào nhiễm virus mất phân tử MHC-I', category: 'Innate' },
        { id: 'im-4', left: 'Hệ thống Bổ thể (Complement)', right: 'Tạo phức hợp tấn công màng (MAC) chọc thủng màng vi khuẩn', category: 'Humoral' }
      ],
      finalKeyword: 'NEXT GEN',
      explanation: 'Hệ thống miễn dịch là đỉnh cao tiến hóa của sinh học, kết hợp giữa đáp ứng bẩm sinh và đáp ứng thích ứng chuyên biệt.'
    },
    finalCode: {
      code: 'IMMUNO-CORE-16',
      hint: 'Mật mã phòng tuyến miễn dịch: IMMUNO-CORE-16',
      systemChecksum: '0x16A4D9'
    },
    active: true
  }
];
