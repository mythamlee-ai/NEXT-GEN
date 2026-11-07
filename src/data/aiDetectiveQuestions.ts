import { AIDetectiveQuestion, BackupMatchingPair } from '../types/round4';

export const defaultBackupMatchingPairs: BackupMatchingPair[] = [
  {
    id: 'pair-1',
    leftId: 'item-flower',
    leftTitle: 'Hoa tươi',
    leftIcon: '🌸',
    leftDescription: 'Những đóa hoa ngát hương dâng lên thầy cô',
    rightId: 'meaning-respect',
    rightTitle: 'Tình cảm kính trọng',
    rightDescription: 'Biểu trưng cho lòng biết ơn, sự tôn kính và tri ân sâu sắc',
    meaning: 'Hoa tươi tượng trưng cho tấm lòng kính trọng, tươi thắm dành tặng người dẫn lối.',
  },
  {
    id: 'pair-2',
    leftId: 'item-book',
    leftTitle: 'Quyển sách',
    leftIcon: '📖',
    leftDescription: 'Trang sách mở ra chân trời tri thức khoa học',
    rightId: 'meaning-knowledge',
    rightTitle: 'Tri thức và học tập',
    rightDescription: 'Nền tảng của sự hiểu biết, hành trình rèn luyện không ngừng',
    meaning: 'Quyển sách kết nối tri thức nhân loại, kim chỉ nam trong suốt hành trình học vấn.',
  },
  {
    id: 'pair-3',
    leftId: 'item-candle',
    leftTitle: 'Ngọn nến',
    leftIcon: '🕯️',
    leftDescription: 'Ngọn lửa ấm áp soi rọi trong đêm tối',
    rightId: 'meaning-candle-light',
    rightTitle: 'Người thầy soi sáng tương lai',
    rightDescription: 'Chấp nhận đốt cháy chính mình để soi đường cho bao thế hệ học trò',
    meaning: 'Hình ảnh ngọn nến tự thiêu đốt để thắp sáng tương lai cho thế hệ mai sau.',
  },
  {
    id: 'pair-4',
    leftId: 'item-mortarboard',
    leftTitle: 'Mũ tốt nghiệp',
    leftIcon: '🎓',
    leftDescription: 'Khoảnh khắc tung cánh bay vào cuộc đời',
    rightId: 'meaning-achievement',
    rightTitle: 'Thành quả của hành trình học tập',
    rightDescription: 'Dấu mốc trưởng thành, kết tinh từ công ơn dạy dỗ và sự nỗ lực',
    meaning: 'Mũ tốt nghiệp ghi dấu thành quả ngọt ngào sau những năm tháng miệt mài bên bục giảng.',
  },
  {
    id: 'pair-5',
    leftId: 'item-teacher',
    leftTitle: 'Người thầy',
    leftIcon: '🧑‍🏫',
    leftDescription: 'Người lái đò thầm lặng trên dòng sông tri thức',
    rightId: 'meaning-inspiration',
    rightTitle: 'Người truyền cảm hứng và đồng hành',
    rightDescription: 'Đánh thức tiềm năng, chắp cánh ước mơ và dõi theo từng bước đi',
    meaning: 'Người thầy không chỉ dạy chữ, mà còn thắp lên ngọn lửa đam mê và đồng hành cùng học trò.',
  },
];

export const defaultAIDetectiveQuestions: AIDetectiveQuestion[] = [
  {
    id: 'ai-q1',
    title: 'Trọng Lực & Rơi Tự Do Trong Chân Không',
    field: 'Vật Lí',
    aiClaim:
      'Khi thả rơi tự do đồng thời một quả cầu sắt 10 kg và một chiếc lông chim 5 gam trong ống chân không hoàn toàn, quả cầu sắt sẽ chạm đáy trước vì lực hấp dẫn tỉ lệ thuận với khối lượng của vật (F = mg).',
    questionText: 'Nhận định trên của AI là ĐÚNG hay SAI?',
    options: [
      { id: 'opt-a', text: 'ĐÚNG – Vật nặng hơn chịu lực hút lớn hơn nên rơi nhanh hơn', isCorrect: false },
      { id: 'opt-b', text: 'SAI – Trong chân không, cả hai vật chạm đáy cùng một thời điểm', isCorrect: true },
      { id: 'opt-c', text: 'SAI – Chiếc lông chim sẽ bay lơ lửng vĩnh viễn không chạm đáy', isCorrect: false },
      { id: 'opt-d', text: 'ĐÚNG – Định luật vạn vật hấp dẫn của Newton đã chứng minh điều này', isCorrect: false },
    ],
    correctOptionId: 'opt-b',
    correctAnswerText: 'SAI – Trong chân không, cả hai vật rơi với cùng gia tốc và chạm đáy cùng lúc.',
    aiFlawExplanation:
      'AI đã nhầm lẫn tai hại giữa LỰC HẤP DẪN và GIA TỐC RƠI TỰ DO. Mặc dù quả cầu sắt chịu trọng lực lớn hơn, nhưng quán tính chống lại sự thay đổi vận tốc của nó cũng lớn hơn đúng bằng tỉ lệ khối lượng (a = F / m = g). Do đó, gia tốc rơi tự do của cả hai vật là như nhau!',
    scientificTruth:
      'Trong môi trường chân không (triệt tiêu hoàn toàn lực cản không khí), mọi vật bất kể khối lượng lớn hay nhỏ đều rơi tự do với cùng gia tốc trọng trường g ≈ 9.8 m/s² và chạm đáy cùng lúc (Thí nghiệm kinh điển của Galileo Galilei và tàu Apollo 15 trên Mặt Trăng).',
    points: 30,
    timeLimitSeconds: 60,
  },
  {
    id: 'ai-q2',
    title: 'Nhiệt Độ Sôi Của Nước Trong Nồi Hở',
    field: 'Hóa Học',
    aiClaim:
      'Để tiệt trùng dụng cụ y tế đạt 120°C nhanh chóng, ta chỉ cần vặn ngọn lửa bếp gas lên mức cực đại liên tục khi đun nước sôi trong một chiếc nồi nhôm hở nắp bình thường.',
    questionText: 'Phát hiện lỗi sai trong chỉ dẫn nhiệt động lực học của AI:',
    options: [
      { id: 'opt-a', text: 'Nồi nhôm hấp thụ nhiệt quá nhanh làm nước nguội đi', isCorrect: false },
      { id: 'opt-b', text: 'Nước trong nồi hở ở áp suất 1 atm chỉ sôi ở 100°C, nhiệt độ không thể tăng thêm dù vặn lửa to', isCorrect: true },
      { id: 'opt-c', text: 'Muốn lên 120°C phải dùng nước cất thay vì nước máy', isCorrect: false },
      { id: 'opt-d', text: 'AI hoàn toàn đúng, nhiệt độ chất lỏng luôn tăng tỷ lệ thuận với nhiệt lượng đốt', isCorrect: false },
    ],
    correctOptionId: 'opt-b',
    correctAnswerText: 'Nước trong nồi hở ở áp suất khí quyển tiêu chuẩn luôn duy trì ở 100°C khi đang sôi.',
    aiFlawExplanation:
      'AI đã bỏ qua nguyên lý chuyển pha nhiệt động học. Khi nước đạt đến nhiệt độ sôi (100°C ở 1 atm), toàn bộ nhiệt lượng cung cấp thêm sẽ chuyển hóa thành nhiệt hóa hơi để biến nước lỏng thành hơi nước, chứ không làm tăng nhiệt độ của khối nước.',
    scientificTruth:
      'Điểm sôi của nước phụ thuộc vào áp suất mặt thoáng. Ở áp suất khí quyển 1 atm, nước sôi ở 100°C và không thể tăng nhiệt độ trong nồi hở. Muốn nước đạt 120°C, bắt buộc phải tăng áp suất (như dùng nồi áp suất / nồi hấp tiệt trùng autoclave).',
    points: 30,
    timeLimitSeconds: 60,
  },
  {
    id: 'ai-q3',
    title: 'Cây Xanh Trong Phòng Ngủ Ban Đêm',
    field: 'Sinh Học',
    aiClaim:
      'Bạn nên đặt thật nhiều chậu cây xanh tươi tốt trong phòng ngủ đóng kín cửa vào ban đêm vì cây sẽ quang hợp tạo ra khí oxy dồi dào, giúp bạn ngủ sâu giấc và thanh lọc phổi.',
    questionText: 'Nhận định sinh học trên của AI có chính xác không?',
    options: [
      { id: 'opt-a', text: 'Chính xác – Thực vật luôn liên tục nhả khí oxy 24/24 giờ', isCorrect: false },
      { id: 'opt-b', text: 'Sai lầm nguy hiểm – Ban đêm không có ánh sáng cây hô hấp hút O2 và thải CO2, gây nguy cơ ngạt thở', isCorrect: true },
      { id: 'opt-c', text: 'Chính xác – Cây xanh hấp thụ toàn bộ CO2 trong phòng kể cả khi tối', isCorrect: false },
      { id: 'opt-d', text: 'Sai – Cây ban đêm sẽ phân hủy chất độc chứ không thải khí', isCorrect: false },
    ],
    correctOptionId: 'opt-b',
    correctAnswerText: 'Sai lầm nguy hiểm – Ban đêm cây chỉ hô hấp (hút O2, thải CO2), trong phòng kín dễ gây ngạt.',
    aiFlawExplanation:
      'AI đã quên điều kiện tiên quyết của quang hợp: QUANG HỢP CẦN NĂNG LƯỢNG ÁNH SÁNG. Vào ban đêm trong phòng tối, lục lạp ngừng quang hợp hoàn toàn. Lúc này, cây chỉ diễn ra quá trình hô hấp tế bào giống như con người.',
    scientificTruth:
      'Ban đêm, thực vật tiêu thụ khí O2 và thải ra khí CO2 qua khí khổng. Nếu đặt nhiều cây trong phòng ngủ nhỏ đóng kín cửa, nồng độ oxy sẽ giảm mạnh trong khi nồng độ CO2 tăng cao, gây đau đầu, khó thở, ngạt khí và đe dọa tính mạng.',
    points: 30,
    timeLimitSeconds: 60,
  },
  {
    id: 'ai-q4',
    title: 'Bản Chất Của Hiệu Ứng Nhà Kính Tự Nhiên',
    field: 'Khoa Học & Đời Sống',
    aiClaim:
      'Hiệu ứng nhà kính là một thảm họa nhân tạo hoàn toàn có hại. Nếu con người loại bỏ được 100% các khí nhà kính (CO2, hơi nước, CH4) khỏi khí quyển thì Trái Đất sẽ trở thành một thiên đường trong lành lý tưởng cho sự sống.',
    questionText: 'Tại sao kết luận của AI là một ngộ nhận khoa học nghiêm trọng?',
    options: [
      { id: 'opt-a', text: 'Vì nếu không có hiệu ứng nhà kính tự nhiên, nhiệt độ trung bình Trái Đất sẽ giảm xuống -18°C và đóng băng hoàn toàn', isCorrect: true },
      { id: 'opt-b', text: 'Vì khí CO2 là nguồn thức ăn duy nhất cho động vật ăn thịt', isCorrect: false },
      { id: 'opt-c', text: 'Vì khí methane CH4 có tác dụng che chắn tia cực tím từ Mặt Trời', isCorrect: false },
      { id: 'opt-d', text: 'AI đúng, khí quyển không cần bất kỳ khí nhà kính nào', isCorrect: false },
    ],
    correctOptionId: 'opt-a',
    correctAnswerText: 'Nếu không có hiệu ứng nhà kính tự nhiên, Trái Đất sẽ bị đóng băng ở -18°C và không có sự sống.',
    aiFlawExplanation:
      'AI đã đồng nhất "Hiệu ứng nhà kính nhân tạo gia tăng do khí thải" với "Hiệu ứng nhà kính tự nhiên". AI không phân biệt được vai trò giữ ấm thiết yếu của lớp khí quyển nguyên thủy đối với hành tinh.',
    scientificTruth:
      'Hiệu ứng nhà kính tự nhiên giữ nhiệt lượng bức xạ hồng ngoại, giúp duy trì nhiệt độ trung bình bề mặt Trái Đất ở mức khoảng +15°C thay vì -18°C. Nhờ đó, nước tồn tại ở thể lỏng và sự sống mới sinh sôi. Vấn đề cần giải quyết là giảm phát thải quá mức làm Trái Đất nóng lên bất thường, chứ không phải triệt tiêu hiệu ứng nhà kính.',
    points: 30,
    timeLimitSeconds: 60,
  },
  {
    id: 'ai-q5',
    title: 'Axit Dạ Dày & Trào Lưu Kiềm Hóa Cực Đoan',
    field: 'Sinh Học',
    aiClaim:
      'Axit clohiđric (HCl) trong dịch vị dạ dày có pH 1.5 - 2.0 là hóa chất ăn mòn nguy hiểm gây ung thư. Do đó, con người cần uống liên tục các dung dịch kiềm mạnh hàng ngày để trung hòa triệt để toàn bộ axit dạ dày.',
    questionText: 'Phản biện lỗi sai sinh hóa học của AI trong nhận định trên:',
    options: [
      { id: 'opt-a', text: 'Dạ dày không chứa axit HCl mà chỉ chứa axit axetic giấm ăn', isCorrect: false },
      { id: 'opt-b', text: 'Axit HCl là thành phần tự nhiên cần thiết để kích hoạt enzyme tiêu hóa và diệt khuẩn; triệt tiêu nó sẽ phá hủy hệ tiêu hóa', isCorrect: true },
      { id: 'opt-c', text: 'Uống kiềm mạnh sẽ biến thức ăn thành kim loại nặng', isCorrect: false },
      { id: 'opt-d', text: 'AI đúng, cơ thể người khỏe mạnh hoàn toàn không có bất kỳ axit nào', isCorrect: false },
    ],
    correctOptionId: 'opt-b',
    correctAnswerText: 'Axit HCl trong dạ dày là chất kích hoạt enzyme tiêu hóa protein và diệt vi khuẩn; trung hòa triệt để sẽ gây tử vong.',
    aiFlawExplanation:
      'AI đã đánh đồng mọi chất có tính axit mạnh đều là độc tố cần đào thải, bỏ qua cơ chế tiến hóa hoàn hảo của hệ tiêu hóa động vật (có lớp chất nhầy mucin bảo vệ thành dạ dày).',
    scientificTruth:
      'Môi trường axit mạnh pH 1.5 - 2.0 là điều kiện bắt buộc để chuyển hóa pepsinogen thành enzyme pepsin tiêu hóa đạm (protein) và tiêu diệt phần lớn mầm bệnh từ thức ăn. Uống kiềm mạnh sẽ gây bỏng thực quản, viêm loét và mất chức năng tiêu hóa.',
    points: 30,
    timeLimitSeconds: 60,
  },
  {
    id: 'ai-q6',
    title: 'Ngụy Biện Tương Quan vs Quan Hệ Nhân Quả',
    field: 'AI & Công Nghệ',
    aiClaim:
      'Phân tích Big Data ghi nhận: Mỗi mùa hè, số lượng kem que bán ra tăng gấp 5 lần đồng thời số ca đuối nước cũng tăng tương ứng gấp 5 lần. AI kết luận chắc chắn: Việc ăn kem là nguyên nhân trực tiếp làm tăng nguy cơ đuối nước!',
    questionText: 'Lỗi tư duy suy luận dữ liệu (Data Fallacy) của AI ở đây là gì?',
    options: [
      { id: 'opt-a', text: 'AI tính toán sai phép nhân số lượng kem', isCorrect: false },
      { id: 'opt-b', text: 'Ngụy biện đánh đồng Mối tương quan thống kê thành Quan hệ nhân quả (Correlation vs Causation)', isCorrect: true },
      { id: 'opt-c', text: 'Big Data không bao giờ ghi nhận số liệu đuối nước', isCorrect: false },
      { id: 'opt-d', text: 'AI hoàn toàn đúng, chất béo trong kem làm người bơi bị chuột rút', isCorrect: false },
    ],
    correctOptionId: 'opt-b',
    correctAnswerText: 'Ngụy biện ngộ nhận tương quan là nhân quả (Correlation does not imply Causation).',
    aiFlawExplanation:
      'AI đã mắc lỗi tư duy dữ liệu sơ đẳng: thấy hai đại lượng biến thiên cùng chiều thì vội vã quy kết đại lượng này sinh ra đại lượng kia, mà bỏ qua yếu tố thứ ba đóng vai trò nguyên nhân ẩn.',
    scientificTruth:
      'Yếu tố nguyên nhân thực sự là "Thời tiết mùa hè nắng nóng". Nắng nóng khiến người dân ăn kem nhiều hơn, và cũng khiến nhiều người đi bơi, tắm biển hơn dẫn đến số vụ đuối nước tăng. Ăn kem và đuối nước chỉ có mối tương quan theo mùa, hoàn toàn không có quan hệ nhân quả trực tiếp.',
    points: 30,
    timeLimitSeconds: 60,
  },
  {
    id: 'ai-q7',
    title: 'Thuyết Tương Đối & Tốc Độ Ánh Sáng',
    field: 'Vật Lí',
    aiClaim:
      'Nếu một phi thuyền vũ trụ bay với tốc độ 250.000 km/s và bật đèn pha chiếu về phía trước, chùm ánh sáng phát ra sẽ di chuyển với tốc độ 550.000 km/s đối với người đứng yên ngoài vũ trụ theo công thức cộng vận tốc v = v1 + v2.',
    questionText: 'Nhận định cơ học trên của AI vi phạm tiên đề vật lí nào?',
    options: [
      { id: 'opt-a', text: 'Vi phạm Tiên đề về tốc độ ánh sáng bất biến trong chân không của Thuyết tương đối hẹp Einstein', isCorrect: true },
      { id: 'opt-b', text: 'Vi phạm Định luật bảo toàn động lượng của Newton', isCorrect: false },
      { id: 'opt-c', text: 'Ánh sáng đèn pha không thể truyền được trong vũ trụ', isCorrect: false },
      { id: 'opt-d', text: 'AI đúng, đèn pha tàu vũ trụ có thể đạt tốc độ vô hạn', isCorrect: false },
    ],
    correctOptionId: 'opt-a',
    correctAnswerText: 'Tốc độ ánh sáng trong chân không là hằng số c ≈ 300.000 km/s bất biến trong mọi hệ quy chiếu.',
    aiFlawExplanation:
      'AI đã áp dụng cơ học cổ điển Galileo/Newton (chỉ đúng ở tốc độ rất nhỏ) vào photon ánh sáng di chuyển ở tốc độ cận quang tốc, bỏ qua Thuyết Tương đối Hẹp.',
    scientificTruth:
      'Theo Tiên đề 2 của Thuyết Tương đối Hẹp Einstein: Tốc độ ánh sáng trong chân không c ≈ 300.000 km/s là một hằng số tuyệt đối, không đổi đối với mọi người quan sát trong mọi hệ quy chiếu quán tính, bất kể nguồn sáng đứng yên hay chuyển động.',
    points: 30,
    timeLimitSeconds: 60,
  },
  {
    id: 'ai-q8',
    title: 'Kháng Sinh & Bệnh Cảm Cúm Do Virus',
    field: 'Sinh Học',
    aiClaim:
      'Khi bạn bị cảm cúm hoặc viêm họng do virus Corona / virus cúm A, giải pháp thông minh và hiệu quả nhất là mua ngay thuốc kháng sinh Amoxicillin uống liều cao để tiêu diệt virus tận gốc.',
    questionText: 'Tại sao chỉ dẫn y khoa này của AI là sai lầm nguy hại?',
    options: [
      { id: 'opt-a', text: 'Vì thuốc kháng sinh chỉ có tác dụng với vi khuẩn, hoàn toàn vô hiệu đối với virus', isCorrect: true },
      { id: 'opt-b', text: 'Vì virus cúm có kích thước to hơn viên thuốc kháng sinh', isCorrect: false },
      { id: 'opt-c', text: 'Vì kháng sinh chỉ dùng để chữa bệnh ngoài da', isCorrect: false },
      { id: 'opt-d', text: 'AI đúng, kháng sinh là thần dược chữa được mọi loại mầm bệnh', isCorrect: false },
    ],
    correctOptionId: 'opt-a',
    correctAnswerText: 'Thuốc kháng sinh chỉ tiêu diệt vi khuẩn, hoàn toàn không có tác dụng với virus cúm.',
    aiFlawExplanation:
      'AI đã nhầm lẫn tai hại giữa hai nhóm sinh vật gây bệnh khác nhau: Vi khuẩn (có cấu trúc tế bào) và Virus (dạng sống chưa có cấu trúc tế bào).',
    scientificTruth:
      'Kháng sinh tác động vào các cơ chế đặc trưng của vi khuẩn như ức chế tổng hợp thành tế bào hoặc ribosome vi khuẩn. Virus ký sinh nội bào và không có thành tế bào nên kháng sinh hoàn toàn bất hoạt. Lạm dụng kháng sinh trị virus không khỏi bệnh mà còn tiêu diệt lợi khuẩn và tạo ra siêu vi khuẩn kháng thuốc.',
    points: 30,
    timeLimitSeconds: 60,
  },
];
