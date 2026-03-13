/**
 * Per-star, per-palace, per-brightness interpretation rules.
 * Structure: RULES[starName][palaceName][brightness] = Vietnamese description
 * Coverage: 14 main stars × 5 key palaces × 3 brightness levels = 210 entries
 */
export const INTERPRETATION_RULES: Record<string, Record<string, Record<string, string>>> = {
  // ============================================================
  // TỬ VI (Emperor Star)
  // ============================================================
  'Tử Vi': {
    'Mệnh': {
      'Miếu': 'Tử Vi Miếu tại Mệnh là cách cục rất tốt. Bạn có tố chất lãnh đạo bẩm sinh, được mọi người kính trọng và tin tưởng. Sự nghiệp phát triển thuận lợi, đặc biệt khi làm việc ở vị trí quản lý hoặc điều hành. Tuy nhiên, Tử Vi Miếu cũng khiến bạn có tính tự tôn cao, đôi khi khó lắng nghe ý kiến người khác.',
      'Bình': 'Tử Vi Bình tại Mệnh cho thấy bạn có tham vọng lớn và tố chất lãnh đạo, nhưng con đường thành công cần nhiều nỗ lực hơn. Bạn cần thêm quý nhân hỗ trợ để phát huy tiềm năng. Giai đoạn đầu đời có thể chưa được như ý, nhưng càng về sau càng vững vàng.',
      'Hãm': 'Tử Vi Hãm tại Mệnh là cách cục cần lưu ý. Bạn có hoài bão lớn nhưng thực tế hay gặp trở ngại. Dễ rơi vào tình trạng \'có danh mà không có thực\' nếu không nỗ lực. Cần đặc biệt tránh kiêu ngạo, nên khiêm tốn và thực tế hơn.',
    },
    'Quan Lộc': {
      'Miếu': 'Tử Vi Miếu ở Quan Lộc cực tốt cho sự nghiệp. Bạn phù hợp làm lãnh đạo, quản lý cấp cao, hoặc tự kinh doanh. Sự nghiệp có tầm ảnh hưởng lớn, được nhiều người biết đến. Đặc biệt phát triển mạnh sau tuổi 30.',
      'Bình': 'Tử Vi Bình ở Quan Lộc cho thấy sự nghiệp có tiềm năng nhưng cần thời gian và cơ hội. Phù hợp làm quản lý tầm trung, hoặc kinh doanh quy mô vừa. Cần cát tinh hỗ trợ để phát huy.',
      'Hãm': 'Tử Vi Hãm ở Quan Lộc khiến sự nghiệp hay thăng trầm. Có vị trí nhưng không bền, dễ mất quyền lực. Nên tránh tranh giành quyền lực, tập trung làm thực chất.',
    },
    'Tài Bạch': {
      'Miếu': 'Tử Vi Miếu tại Tài Bạch mang lại tài lộc dồi dào. Khả năng quản lý tài chính tốt, biết cách kiếm tiền từ vị thế và uy tín. Phú quý tự nhiên đến, không cần quá vất vả. Thu nhập cao và ổn định.',
      'Bình': 'Tử Vi Bình tại Tài Bạch cho thu nhập ổn định nhưng không có đột phá lớn. Tài chính đủ dùng, không thiếu thốn nhưng cũng khó giàu nhanh. Cần thêm nỗ lực và cơ hội.',
      'Hãm': 'Tử Vi Hãm tại Tài Bạch khiến tài chính bấp bênh. Có lúc nhiều tiền nhưng cũng hay hao tốn không kiểm soát. Cần cẩn thận trong đầu tư, tránh xa cờ bạc và cho vay.',
    },
    'Phu Thê': {
      'Miếu': 'Tử Vi Miếu tại Phu Thê là cách cục tốt cho hôn nhân. Bạn đời có tố chất lãnh đạo, gia thế tốt, hoặc thành đạt trong sự nghiệp. Quan hệ vợ chồng tôn trọng lẫn nhau, hôn nhân bền vững.',
      'Bình': 'Tử Vi Bình tại Phu Thê cho thấy hôn nhân bình thường, bạn đời có năng lực nhưng chưa nổi bật. Cần vun đắp tình cảm và tôn trọng lẫn nhau để duy trì hạnh phúc.',
      'Hãm': 'Tử Vi Hãm tại Phu Thê khiến hôn nhân nhiều sóng gió. Bạn đời có tính tự tôn cao, khó nhượng bộ. Dễ xảy ra mâu thuẫn về quyền lực trong gia đình. Cần kiên nhẫn và bao dung.',
    },
    'Tật Ách': {
      'Miếu': 'Tử Vi Miếu tại Tật Ách cho sức khỏe tốt, ít bệnh tật, có phúc đức bảo vệ. Thể trạng mạnh mẽ, tuổi thọ cao. Nếu có bệnh cũng mau khỏi, có quý nhân giúp đỡ.',
      'Bình': 'Tử Vi Bình tại Tật Ách cho sức khỏe tạm ổn, không có bệnh nặng nhưng hay mệt mỏi. Cần chú ý nghỉ ngơi hợp lý, tránh làm việc quá sức.',
      'Hãm': 'Tử Vi Hãm tại Tật Ách cảnh báo sức khỏe yếu, dễ mắc bệnh mạn tính. Cần khám sức khỏe định kỳ, chú ý tim mạch và huyết áp. Tránh stress kéo dài.',
    },
  },

  // ============================================================
  // THIÊN CƠ (Strategist Star)
  // ============================================================
  'Thiên Cơ': {
    'Mệnh': {
      'Miếu': 'Thiên Cơ Miếu tại Mệnh cho thấy bạn cực kỳ thông minh, sáng tạo, phản ứng nhanh. Giỏi lập kế hoạch và tính toán, có tư duy chiến lược xuất sắc. Phù hợp với công việc đòi hỏi trí tuệ như kỹ sư, nhà nghiên cứu, cố vấn.',
      'Bình': 'Thiên Cơ Bình tại Mệnh cho thấy bạn có đầu óc tốt nhưng hay do dự, thiếu quyết đoán. Nhiều ý tưởng nhưng đôi khi khó thực hiện đến cùng. Cần rèn luyện tính kiên định.',
      'Hãm': 'Thiên Cơ Hãm tại Mệnh khiến bạn hay lo lắng quá mức, suy nghĩ nhiều nhưng ít hành động. Dễ bỏ lỡ cơ hội vì do dự. Tâm trạng thất thường, cần học cách buông bỏ và quyết đoán hơn.',
    },
    'Quan Lộc': {
      'Miếu': 'Thiên Cơ Miếu ở Quan Lộc rất tốt cho nghề tư vấn, kỹ thuật, lập trình, hoạch định chiến lược. Bạn có khả năng phân tích vấn đề sắc bén, tìm ra giải pháp nhanh chóng. Sự nghiệp phát triển nhờ trí tuệ.',
      'Bình': 'Thiên Cơ Bình ở Quan Lộc cho công việc đòi hỏi tư duy nhưng hay thay đổi hướng. Khó gắn bó lâu dài với một lĩnh vực. Nên tìm công việc linh hoạt, tránh môi trường cứng nhắc.',
      'Hãm': 'Thiên Cơ Hãm ở Quan Lộc khiến sự nghiệp không ổn định, hay nhảy việc, thay đổi kế hoạch liên tục. Nhiều dự định nhưng ít thành. Cần tập trung vào một hướng và kiên trì theo đuổi.',
    },
    'Tài Bạch': {
      'Miếu': 'Thiên Cơ Miếu tại Tài Bạch giúp kiếm tiền bằng trí tuệ và sáng tạo. Thu nhập tốt từ công việc chuyên môn, tư vấn, hoặc đầu tư thông minh. Biết tính toán và quản lý tài chính.',
      'Bình': 'Thiên Cơ Bình tại Tài Bạch cho thu nhập bình thường từ công việc trí tuệ. Tài chính không ổn định lắm, có lúc lên lúc xuống. Cần kỷ luật trong chi tiêu.',
      'Hãm': 'Thiên Cơ Hãm tại Tài Bạch khiến tài chính bấp bênh. Hay tính toán sai, đầu tư thua lỗ. Tiền đến rồi đi, khó tích lũy. Nên tránh đầu cơ mạo hiểm.',
    },
    'Phu Thê': {
      'Miếu': 'Thiên Cơ Miếu tại Phu Thê cho thấy bạn đời thông minh, khéo léo, biết cách xử lý tình huống. Mối quan hệ có chiều sâu trí tuệ, hai người hay trao đổi và học hỏi lẫn nhau.',
      'Bình': 'Thiên Cơ Bình tại Phu Thê cho mối quan hệ hay suy nghĩ và phân tích quá nhiều. Bạn đời có trí tuệ nhưng hay do dự, tình cảm thiếu ổn định. Cần giao tiếp thẳng thắn.',
      'Hãm': 'Thiên Cơ Hãm tại Phu Thê khiến hôn nhân nhiều lo lắng, bạn đời hay thay đổi ý kiến. Dễ xảy ra hiểu lầm và mâu thuẫn do suy nghĩ quá nhiều. Cần tin tưởng và đơn giản hóa vấn đề.',
    },
    'Tật Ách': {
      'Miếu': 'Thiên Cơ Miếu tại Tật Ách cho sức khỏe tương đối tốt, nhưng cần chú ý hệ thần kinh. Bạn hay suy nghĩ nhiều nên dễ stress. Tập thiền, yoga sẽ rất có lợi.',
      'Bình': 'Thiên Cơ Bình tại Tật Ách cho thấy hay mất ngủ, lo lắng ảnh hưởng sức khỏe. Hệ thần kinh nhạy cảm, cần chú ý nghỉ ngơi. Tránh caffeine và chất kích thích.',
      'Hãm': 'Thiên Cơ Hãm tại Tật Ách cảnh báo vấn đề thần kinh và tâm lý. Dễ mắc trầm cảm, rối loạn lo âu. Cần tìm người hỗ trợ tâm lý và tập thể dục thường xuyên.',
    },
  },

  // ============================================================
  // THÁI DƯƠNG (Sun Star)
  // ============================================================
  'Thái Dương': {
    'Mệnh': {
      'Miếu': 'Thái Dương Miếu tại Mệnh là cách cục rất sáng sủa. Bạn rộng lượng, có lòng nhân ái, giỏi giao tiếp và được mọi người yêu mến. Sự nghiệp phát triển tốt, đặc biệt trong lĩnh vực công khai. Là người có ảnh hưởng tích cực đến cộng đồng.',
      'Bình': 'Thái Dương Bình tại Mệnh cho thấy bạn nhiệt tình, thích giúp đỡ nhưng đôi khi quá lý tưởng. Hay cho đi nhiều hơn nhận lại. Cần cân bằng giữa lý tưởng và thực tế.',
      'Hãm': 'Thái Dương Hãm tại Mệnh khiến cuộc đời vất vả. Bạn cho nhiều hơn nhận, lao động cực nhọc nhưng thành quả ít. Dễ gặp thị phi, mâu thuẫn với cấp trên. Cần biết giữ mình, không nên quá bộc trực.',
    },
    'Quan Lộc': {
      'Miếu': 'Thái Dương Miếu ở Quan Lộc mang lại sự nghiệp rạng rỡ. Phù hợp ngành truyền thông, giáo dục, chính trị, ngoại giao. Được nhiều người biết đến, danh tiếng tốt. Sự nghiệp đi lên từ tuổi trẻ.',
      'Bình': 'Thái Dương Bình ở Quan Lộc cho sự nghiệp bình thường, cần nỗ lực nhiều để thành công. Phù hợp công việc phục vụ cộng đồng nhưng chưa nổi bật lắm.',
      'Hãm': 'Thái Dương Hãm ở Quan Lộc khiến sự nghiệp nhiều trở ngại, dễ bị thị phi gièm pha. Làm việc vất vả nhưng ít được công nhận. Nên tránh ngành chính trị, truyền thông.',
    },
    'Tài Bạch': {
      'Miếu': 'Thái Dương Miếu tại Tài Bạch cho tài lộc sáng sủa. Kiếm tiền bằng danh tiếng và uy tín. Phù hợp kinh doanh quy mô lớn, công việc mang tính công khai. Thu nhập ổn định và tăng dần.',
      'Bình': 'Thái Dương Bình tại Tài Bạch cho thu nhập trung bình. Kiếm tiền vất vả, hay chi tiêu cho người khác. Cần biết giữ tiền cho bản thân.',
      'Hãm': 'Thái Dương Hãm tại Tài Bạch khiến tài chính khó khăn. Kiếm được bao nhiêu tiêu hết bấy nhiêu, khó tích lũy. Hay bị lừa đảo hoặc mất tiền vì tin người.',
    },
    'Phu Thê': {
      'Miếu': 'Thái Dương Miếu tại Phu Thê tốt cho hôn nhân. Bạn đời rộng lượng, thành đạt, có vị trí xã hội tốt. Mối quan hệ hài hòa, hai người hỗ trợ nhau phát triển.',
      'Bình': 'Thái Dương Bình tại Phu Thê cho mối quan hệ bình thường. Bạn đời nhiệt tình nhưng hay bận rộn, ít dành thời gian cho gia đình. Cần cân bằng công việc và hôn nhân.',
      'Hãm': 'Thái Dương Hãm tại Phu Thê khiến hôn nhân nhiều khó khăn. Bạn đời hay gặp vấn đề trong sự nghiệp, ảnh hưởng đến tình cảm. Kết hôn muộn hoặc khác biệt tuổi tác có thể tốt hơn.',
    },
    'Tật Ách': {
      'Miếu': 'Thái Dương Miếu tại Tật Ách cho sức khỏe tốt, tràn đầy năng lượng. Tuy nhiên cần chú ý mắt và đầu. Nên tránh nhìn màn hình quá lâu.',
      'Bình': 'Thái Dương Bình tại Tật Ách cho sức khỏe trung bình. Hay đau đầu, mỏi mắt, huyết áp không ổn. Cần khám mắt và kiểm tra huyết áp định kỳ.',
      'Hãm': 'Thái Dương Hãm tại Tật Ách cảnh báo vấn đề về mắt, đầu, tim. Dễ mắc các bệnh liên quan đến lửa (viêm, sốt). Cần đặc biệt bảo vệ thị lực.',
    },
  },

  // ============================================================
  // VŨ KHÚC (Warrior Finance Star)
  // ============================================================
  'Vũ Khúc': {
    'Mệnh': {
      'Miếu': 'Vũ Khúc Miếu tại Mệnh cho tính cách quyết đoán, mạnh mẽ, có đầu óc kinh doanh tài ba. Giỏi tài chính, biết cách kiếm tiền và quản lý tài sản. Tuy nhiên hơi cứng nhắc trong giao tiếp, cần mềm dẻo hơn.',
      'Bình': 'Vũ Khúc Bình tại Mệnh cho tính cách cương nghị nhưng thiếu mềm dẻo. Có năng lực tài chính nhưng chưa phát huy hết. Cần học cách giao tiếp và hợp tác để thành công.',
      'Hãm': 'Vũ Khúc Hãm tại Mệnh khiến cuộc sống cô đơn, cứng nhắc, khó hòa nhập. Tài chính bấp bênh, hay gặp rủi ro. Tính cách quá mạnh mẽ gây xa cách mọi người. Cần học cách lắng nghe.',
    },
    'Quan Lộc': {
      'Miếu': 'Vũ Khúc Miếu ở Quan Lộc xuất sắc cho nghề tài chính, ngân hàng, kinh doanh. Bạn có tài năng quản lý tiền bạc, đầu tư chính xác. Sự nghiệp phát triển mạnh trong lĩnh vực kinh tế.',
      'Bình': 'Vũ Khúc Bình ở Quan Lộc cho sự nghiệp liên quan tài chính, nhưng quy mô vừa phải. Kinh doanh có lãi nhưng không lớn. Cần kiên trì và tích lũy dần.',
      'Hãm': 'Vũ Khúc Hãm ở Quan Lộc khiến sự nghiệp nhiều rủi ro tài chính. Dễ thua lỗ, mất vốn. Nên tránh đầu tư mạo hiểm, làm công ăn lương an toàn hơn.',
    },
    'Tài Bạch': {
      'Miếu': 'Vũ Khúc Miếu tại Tài Bạch — tài tinh đắc địa, cực kỳ tốt cho tài chính. Bạn có khả năng kiếm tiền xuất sắc, quản lý tài sản giỏi, giàu có bền vững. Phù hợp đầu tư dài hạn.',
      'Bình': 'Vũ Khúc Bình tại Tài Bạch cho thu nhập khá nhưng hay chi tiêu lớn. Kiếm được nhiều nhưng cũng tiêu nhiều. Cần kỷ luật tài chính để tích lũy.',
      'Hãm': 'Vũ Khúc Hãm tại Tài Bạch khiến tài chính nhiều sóng gió, dễ mất tiền do liều lĩnh. Hay bị phá sản hoặc nợ nần. Tuyệt đối tránh cờ bạc và đầu cơ.',
    },
    'Phu Thê': {
      'Miếu': 'Vũ Khúc Miếu tại Phu Thê cho bạn đời quyết đoán, giỏi kinh doanh, có tài chính tốt. Mối quan hệ dựa trên sự tôn trọng lẫn nhau, hôn nhân ổn định.',
      'Bình': 'Vũ Khúc Bình tại Phu Thê cho mối quan hệ hơi cứng nhắc. Bạn đời có năng lực nhưng thiếu lãng mạn. Cần thêm sự quan tâm và chia sẻ tình cảm.',
      'Hãm': 'Vũ Khúc Hãm tại Phu Thê khiến hôn nhân khó khăn. Bạn đời quá cứng nhắc hoặc vấn đề tài chính gây mâu thuẫn. Kết hôn muộn có thể tốt hơn. Cần nhường nhịn nhiều.',
    },
    'Tật Ách': {
      'Miếu': 'Vũ Khúc Miếu tại Tật Ách cho sức khỏe tốt, thể chất mạnh mẽ. Cần chú ý phổi, đường hô hấp (Kim). Tập thể dục ngoài trời rất có lợi.',
      'Bình': 'Vũ Khúc Bình tại Tật Ách cho sức khỏe trung bình. Hay bị viêm họng, viêm phế quản, vấn đề da. Cần chú ý bảo vệ đường hô hấp.',
      'Hãm': 'Vũ Khúc Hãm tại Tật Ách cảnh báo bệnh về phổi, xương, tai nạn. Dễ bị thương do vật sắc nhọn (Kim). Cần cẩn thận khi lái xe và làm việc nặng.',
    },
  },

  // ============================================================
  // THIÊN ĐỒNG (Joy/Ease Star)
  // ============================================================
  'Thiên Đồng': {
    'Mệnh': {
      'Miếu': 'Thiên Đồng Miếu tại Mệnh cho tính cách hiền hòa, vui vẻ, lạc quan. Bạn sống an nhàn, hưởng phúc, được nhiều người quý mến. Cuộc đời ít sóng gió, phù hợp nghề nghệ thuật, giải trí, phúc lợi xã hội.',
      'Bình': 'Thiên Đồng Bình tại Mệnh cho thấy bạn thích hưởng thụ nhưng thiếu chí tiến thủ. An phận, ít tham vọng lớn. Cuộc sống bình thường nhưng thoải mái.',
      'Hãm': 'Thiên Đồng Hãm tại Mệnh khiến bạn lười biếng, thiếu động lực, hay than phiền. Cuộc sống vất vả vì thiếu nỗ lực. Cần rèn luyện kỷ luật và ý chí để vượt qua.',
    },
    'Quan Lộc': {
      'Miếu': 'Thiên Đồng Miếu ở Quan Lộc phù hợp nghề nghệ thuật, giải trí, du lịch, xã hội. Công việc nhẹ nhàng nhưng thu nhập tốt. Sự nghiệp phát triển nhờ quan hệ xã hội.',
      'Bình': 'Thiên Đồng Bình ở Quan Lộc cho công việc ổn định nhưng ít đột phá. Phù hợp công chức, nhân viên phúc lợi. Không nên mạo hiểm kinh doanh.',
      'Hãm': 'Thiên Đồng Hãm ở Quan Lộc khiến sự nghiệp trì trệ, thiếu động lực phát triển. Hay chán việc, muốn nghỉ ngơi nhiều hơn làm. Cần đặt mục tiêu rõ ràng và kiên trì.',
    },
    'Tài Bạch': {
      'Miếu': 'Thiên Đồng Miếu tại Tài Bạch cho tài lộc đến nhẹ nhàng, không cần vất vả quá. Phù hợp thu nhập từ nghệ thuật, giải trí, dịch vụ. Biết hưởng thụ nhưng cũng biết giữ tiền.',
      'Bình': 'Thiên Đồng Bình tại Tài Bạch cho thu nhập đủ dùng nhưng khó giàu. Hay tiêu tiền vào hưởng thụ. Cần kỷ luật tài chính hơn.',
      'Hãm': 'Thiên Đồng Hãm tại Tài Bạch khiến tài chính eo hẹp. Lười kiếm tiền nhưng thích tiêu xài. Dễ rơi vào cảnh nợ nần nếu không thay đổi thái độ.',
    },
    'Phu Thê': {
      'Miếu': 'Thiên Đồng Miếu tại Phu Thê rất tốt cho hôn nhân. Bạn đời hiền lành, vui vẻ, biết hưởng thụ cuộc sống. Gia đình hạnh phúc, hòa thuận.',
      'Bình': 'Thiên Đồng Bình tại Phu Thê cho mối quan hệ bình thường. Bạn đời dễ tính nhưng thiếu tham vọng. Cuộc sống vợ chồng êm ấm nhưng ít tiến bộ.',
      'Hãm': 'Thiên Đồng Hãm tại Phu Thê cho bạn đời thiếu chí tiến thủ, hay than phiền. Hôn nhân thiếu động lực phát triển. Cần động viên nhau để cùng tiến lên.',
    },
    'Tật Ách': {
      'Miếu': 'Thiên Đồng Miếu tại Tật Ách cho sức khỏe tốt nhìn chung. Tuy nhiên hay tăng cân vì thích ăn uống. Cần chú ý dinh dưỡng và tập thể dục đều đặn.',
      'Bình': 'Thiên Đồng Bình tại Tật Ách cho sức khỏe tạm, hay bị vấn đề tiêu hóa do ăn uống không điều độ. Cần chú ý chế độ ăn.',
      'Hãm': 'Thiên Đồng Hãm tại Tật Ách cảnh báo về tiêu hóa, béo phì, tiểu đường. Lối sống thiếu vận động gây nhiều vấn đề sức khỏe. Cần tập thể dục và ăn uống lành mạnh.',
    },
  },

  // ============================================================
  // LIÊM TRINH (Integrity/Complex Star)
  // ============================================================
  'Liêm Trinh': {
    'Mệnh': {
      'Miếu': 'Liêm Trinh Miếu tại Mệnh cho tính cách thông minh, đa tài, có khí chất quý phái. Giỏi ngoại giao, biết cách xử lý tình huống phức tạp. Phù hợp nghề luật, quản lý, ngoại giao.',
      'Bình': 'Liêm Trinh Bình tại Mệnh cho tính cách phức tạp, hay suy nghĩ nhiều. Có năng lực nhưng đôi khi quá cầu toàn. Cần đơn giản hóa cuộc sống và quyết đoán hơn.',
      'Hãm': 'Liêm Trinh Hãm tại Mệnh dễ gặp rắc rối, thị phi, quan tụng. Tính cách phức tạp, khó được người khác hiểu. Cần đặc biệt cẩn trọng trong giao tiếp và quan hệ.',
    },
    'Quan Lộc': {
      'Miếu': 'Liêm Trinh Miếu ở Quan Lộc phù hợp nghề luật, kiểm toán, quân đội, công an. Sự nghiệp phát triển nhờ tính kỷ luật và công chính. Có uy tín trong ngành.',
      'Bình': 'Liêm Trinh Bình ở Quan Lộc cho sự nghiệp bình thường. Công việc đòi hỏi tính chính xác và kỷ luật. Có thể gặp rắc rối nhỏ nhưng không nghiêm trọng.',
      'Hãm': 'Liêm Trinh Hãm ở Quan Lộc cảnh báo vấn đề pháp lý trong sự nghiệp. Dễ bị kiện tụng, thị phi công việc. Nên tránh ngành nhạy cảm, làm việc thận trọng.',
    },
    'Tài Bạch': {
      'Miếu': 'Liêm Trinh Miếu tại Tài Bạch cho tài chính tốt từ nghề chuyên môn. Biết cách quản lý tài sản, đầu tư cẩn thận. Thu nhập ổn định từ công việc trí tuệ.',
      'Bình': 'Liêm Trinh Bình tại Tài Bạch cho thu nhập trung bình. Tài chính đủ dùng nhưng hay gặp chi phí bất ngờ. Cần có quỹ dự phòng.',
      'Hãm': 'Liêm Trinh Hãm tại Tài Bạch cảnh báo mất tiền do thị phi, kiện tụng. Tài chính nhiều rủi ro pháp lý. Tuyệt đối tránh liên quan đến tiền bạc không rõ ràng.',
    },
    'Phu Thê': {
      'Miếu': 'Liêm Trinh Miếu tại Phu Thê cho bạn đời thông minh, đa tài, có vẻ ngoài hấp dẫn. Mối quan hệ sâu sắc, có chiều sâu. Tuy nhiên cũng dễ ghen tuông.',
      'Bình': 'Liêm Trinh Bình tại Phu Thê cho mối quan hệ phức tạp. Bạn đời có tính cách mạnh, khó đoán. Cần thấu hiểu và kiên nhẫn để duy trì tình cảm.',
      'Hãm': 'Liêm Trinh Hãm tại Phu Thê khiến hôn nhân rất phức tạp. Dễ gặp tam giác tình cảm, thị phi. Kết hôn muộn sẽ tốt hơn. Cần cực kỳ thận trọng trong chọn bạn đời.',
    },
    'Tật Ách': {
      'Miếu': 'Liêm Trinh Miếu tại Tật Ách cho sức khỏe tốt nhưng cần chú ý tim, máu (Hỏa). Tránh stress và nóng giận. Tập thể dục điều độ rất quan trọng.',
      'Bình': 'Liêm Trinh Bình tại Tật Ách cho sức khỏe trung bình, hay bị nóng trong, mụn nhọt. Cần chú ý ăn mát, uống đủ nước.',
      'Hãm': 'Liêm Trinh Hãm tại Tật Ách cảnh báo bệnh về máu, tim, da. Dễ bị tai nạn, cần cẩn thận với lửa và điện. Khám sức khỏe định kỳ rất quan trọng.',
    },
  },

  // ============================================================
  // THIÊN PHỦ (Treasury Star)
  // ============================================================
  'Thiên Phủ': {
    'Mệnh': {
      'Miếu': 'Thiên Phủ Miếu tại Mệnh cho tính cách ôn hòa, đại lượng, bao dung. Tài lộc tốt, cuộc sống sung túc. Biết cách quản lý và tích lũy tài sản. Được nhiều người tin tưởng và quý mến.',
      'Bình': 'Thiên Phủ Bình tại Mệnh cho cuộc sống ổn định, an phận. Không thiếu thốn nhưng cũng khó giàu có lớn. Tính cách hiền lành, dễ chịu.',
      'Hãm': 'Thiên Phủ Hãm tại Mệnh khiến tính cách tham lam, thiếu bao dung, hay tính toán nhỏ nhen. Muốn nhiều nhưng khả năng hạn chế. Cần rèn luyện tính rộng rãi.',
    },
    'Quan Lộc': {
      'Miếu': 'Thiên Phủ Miếu ở Quan Lộc rất tốt cho nghề quản lý tài sản, bất động sản, ngân hàng, bảo hiểm. Sự nghiệp ổn định, phát triển bền vững. Được cấp trên tin tưởng giao phó.',
      'Bình': 'Thiên Phủ Bình ở Quan Lộc cho sự nghiệp ổn định nhưng không nổi bật. Phù hợp công việc hành chính, quản lý kho bãi, tài sản. An toàn nhưng ít đột phá.',
      'Hãm': 'Thiên Phủ Hãm ở Quan Lộc khiến sự nghiệp trì trệ, khó thăng tiến. Quản lý tài sản kém, dễ mất uy tín. Cần nâng cao chuyên môn và thay đổi tư duy.',
    },
    'Tài Bạch': {
      'Miếu': 'Thiên Phủ Miếu tại Tài Bạch — kho tàng đầy đủ, tài lộc dồi dào. Biết cách giữ tiền và tích lũy tài sản. Phù hợp đầu tư bất động sản, vàng, tài sản an toàn.',
      'Bình': 'Thiên Phủ Bình tại Tài Bạch cho tài chính đủ dùng nhưng không dư giả nhiều. Biết tiết kiệm nhưng ít cơ hội phát triển vượt trội.',
      'Hãm': 'Thiên Phủ Hãm tại Tài Bạch khiến giữ tiền kém, dễ mất tài sản. Hay chi tiêu hoang phí hoặc bị lừa mất tiền. Cần rất thận trọng trong quản lý tài chính.',
    },
    'Phu Thê': {
      'Miếu': 'Thiên Phủ Miếu tại Phu Thê rất tốt cho hôn nhân. Bạn đời hiền lành, chu đáo, có tài chính tốt. Gia đình ấm cúng, hạnh phúc, cuộc sống sung túc.',
      'Bình': 'Thiên Phủ Bình tại Phu Thê cho hôn nhân ổn định, bạn đời thực tế, biết lo liệu. Không lãng mạn lắm nhưng đáng tin cậy.',
      'Hãm': 'Thiên Phủ Hãm tại Phu Thê cho bạn đời tham lam, hay tính toán. Mâu thuẫn về tiền bạc có thể ảnh hưởng hôn nhân. Cần minh bạch tài chính.',
    },
    'Tật Ách': {
      'Miếu': 'Thiên Phủ Miếu tại Tật Ách cho sức khỏe tốt, thể trạng đầy đặn. Cần chú ý cân nặng và đường ruột (Thổ). Ăn uống điều độ rất quan trọng.',
      'Bình': 'Thiên Phủ Bình tại Tật Ách cho sức khỏe ổn, nhưng dễ tăng cân. Hệ tiêu hóa nhạy cảm, cần ăn uống lành mạnh.',
      'Hãm': 'Thiên Phủ Hãm tại Tật Ách cảnh báo béo phì, tiểu đường, dạ dày. Lối sống ít vận động gây nhiều bệnh. Cần tập thể dục và kiểm soát chế độ ăn.',
    },
  },

  // ============================================================
  // THÁI ÂM (Moon Star)
  // ============================================================
  'Thái Âm': {
    'Mệnh': {
      'Miếu': 'Thái Âm Miếu tại Mệnh cho tính cách nhu mì, nhạy cảm, giàu trí tưởng tượng. Thiên về nghệ thuật, thiết kế, sáng tạo. Có trực giác tốt, biết đồng cảm với người khác. Đặc biệt tốt cho nữ mạng.',
      'Bình': 'Thái Âm Bình tại Mệnh cho tình cảm sâu sắc nhưng hay ưu tư. Nhạy cảm quá mức, dễ bị tổn thương. Cần rèn luyện tinh thần mạnh mẽ hơn.',
      'Hãm': 'Thái Âm Hãm tại Mệnh khiến cuộc sống u sầu, bi quan. Hay gặp chuyện buồn, sức khỏe tinh thần yếu. Đặc biệt bất lợi cho nam mạng. Cần tìm niềm vui và mục tiêu sống.',
    },
    'Quan Lộc': {
      'Miếu': 'Thái Âm Miếu ở Quan Lộc phù hợp nghề bất động sản, tài chính, nghệ thuật, thiết kế. Sự nghiệp phát triển tốt về đêm hoặc lĩnh vực liên quan phụ nữ.',
      'Bình': 'Thái Âm Bình ở Quan Lộc cho sự nghiệp bình thường, ổn định. Phù hợp công việc yên tĩnh, không cần giao tiếp nhiều.',
      'Hãm': 'Thái Âm Hãm ở Quan Lộc khiến sự nghiệp trì trệ, thiếu ánh sáng. Hay gặp tiểu nhân, bị gièm pha. Tránh kinh doanh ban đêm.',
    },
    'Tài Bạch': {
      'Miếu': 'Thái Âm Miếu tại Tài Bạch rất tốt cho tài chính. Giàu có từ bất động sản, đầu tư ẩn. Thu nhập ổn định, tích lũy tốt. Đặc biệt thuận lợi kinh doanh nhà đất.',
      'Bình': 'Thái Âm Bình tại Tài Bạch cho thu nhập trung bình, chủ yếu từ công việc ổn định. Tài chính đủ dùng nhưng khó phát triển mạnh.',
      'Hãm': 'Thái Âm Hãm tại Tài Bạch khiến tài chính khó khăn, hay mất tiền vì thiếu tỉnh táo. Tránh đầu tư bất động sản khi Thái Âm hãm. Cần thận trọng trong mọi giao dịch.',
    },
    'Phu Thê': {
      'Miếu': 'Thái Âm Miếu tại Phu Thê tốt cho hôn nhân. Bạn đời dịu dàng, đẹp người, có tài chính ổn định. Đời sống tình cảm phong phú, lãng mạn.',
      'Bình': 'Thái Âm Bình tại Phu Thê cho tình cảm bình thường, cần vun đắp. Bạn đời nhạy cảm, đôi khi hay buồn. Cần quan tâm và thấu hiểu.',
      'Hãm': 'Thái Âm Hãm tại Phu Thê khiến hôn nhân nhiều trắc trở. Bạn đời hay buồn phiền, tình cảm bất ổn. Dễ chia tay nếu không kiên nhẫn. Kết hôn muộn tốt hơn.',
    },
    'Tật Ách': {
      'Miếu': 'Thái Âm Miếu tại Tật Ách cho sức khỏe tương đối tốt. Cần chú ý thận, bàng quang (Thủy). Nên uống đủ nước và giữ ấm cơ thể.',
      'Bình': 'Thái Âm Bình tại Tật Ách cho sức khỏe trung bình, hay mất ngủ. Hệ thần kinh nhạy cảm, dễ mệt mỏi. Cần ngủ đủ giấc và tránh thức khuya.',
      'Hãm': 'Thái Âm Hãm tại Tật Ách cảnh báo bệnh phụ khoa (nữ), thận, mắt. Hay mất ngủ, trầm cảm. Cần đặc biệt chú ý sức khỏe tinh thần và khám định kỳ.',
    },
  },

  // ============================================================
  // THAM LANG (Greedy Wolf/Desire Star)
  // ============================================================
  'Tham Lang': {
    'Mệnh': {
      'Miếu': 'Tham Lang Miếu tại Mệnh cho tính cách đa tài, ham học hỏi, giỏi giao tiếp và thu hút người khác. Bạn có sức hấp dẫn tự nhiên, tài năng đa dạng. Phù hợp nghề sáng tạo, giải trí, marketing.',
      'Bình': 'Tham Lang Bình tại Mệnh cho nhiều sở thích nhưng thiếu chuyên sâu, dễ phân tán. Quan hệ xã hội rộng nhưng không sâu. Cần tập trung vào một lĩnh vực để thành công.',
      'Hãm': 'Tham Lang Hãm tại Mệnh khiến bạn ham mê vật chất, dễ sa vào cám dỗ (rượu, cờ bạc, sắc dục). Cần tự kỷ luật cao. Nếu biết chế ngự dục vọng thì vẫn thành đạt.',
    },
    'Quan Lộc': {
      'Miếu': 'Tham Lang Miếu ở Quan Lộc tuyệt vời cho nghề marketing, sales, giải trí, ẩm thực, du lịch. Sáng tạo và xã giao tốt giúp sự nghiệp phát triển nhanh. Nhiều mối quan hệ hỗ trợ.',
      'Bình': 'Tham Lang Bình ở Quan Lộc cho sự nghiệp liên quan giao tiếp, giải trí nhưng không ổn định. Hay thay đổi ngành nghề. Cần tìm đam mê thực sự để gắn bó.',
      'Hãm': 'Tham Lang Hãm ở Quan Lộc khiến sự nghiệp sa đọa nếu không cẩn thận. Dễ bị cuốn vào ngành nhạy cảm. Cần chọn nghề nghiệp chính đáng và giữ kỷ luật.',
    },
    'Tài Bạch': {
      'Miếu': 'Tham Lang Miếu tại Tài Bạch giúp kiếm tiền nhờ tài giao tiếp và quan hệ. Thu nhập tốt từ nhiều nguồn. Có tài ngoại giao, biết cách mở rộng kinh doanh.',
      'Bình': 'Tham Lang Bình tại Tài Bạch cho thu nhập từ quan hệ xã hội, nhưng hay tiêu xài phung phí. Tiền vào nhiều nhưng ra cũng nhanh.',
      'Hãm': 'Tham Lang Hãm tại Tài Bạch cảnh báo mất tiền do ham mê, cờ bạc, rượu chè. Tài chính bấp bênh. Cần kiểm soát chi tiêu nghiêm ngặt.',
    },
    'Phu Thê': {
      'Miếu': 'Tham Lang Miếu tại Phu Thê cho bạn đời hấp dẫn, tài năng, đa dạng. Đời sống tình cảm phong phú, lãng mạn. Tuy nhiên cũng dễ phát sinh quan hệ ngoài hôn nhân.',
      'Bình': 'Tham Lang Bình tại Phu Thê cho mối quan hệ có nhiều thay đổi. Bạn đời hấp dẫn nhưng khó nắm giữ. Cần tin tưởng và cho nhau không gian.',
      'Hãm': 'Tham Lang Hãm tại Phu Thê rất bất lợi cho hôn nhân. Dễ ngoại tình, tam giác tình cảm. Hôn nhân nhiều sóng gió, có thể kết hôn nhiều lần.',
    },
    'Tật Ách': {
      'Miếu': 'Tham Lang Miếu tại Tật Ách cho sức khỏe tốt nhưng cần chú ý gan, thận. Tránh rượu bia và chất kích thích. Tập thể dục đều đặn giữ sức khỏe lâu dài.',
      'Bình': 'Tham Lang Bình tại Tật Ách cho sức khỏe trung bình, hay bị vấn đề về gan nếu uống rượu nhiều. Cần kiểm tra gan định kỳ.',
      'Hãm': 'Tham Lang Hãm tại Tật Ách cảnh báo bệnh về gan, thận, sinh dục. Đặc biệt nguy hiểm nếu nghiện rượu hoặc chất kích thích. Cần sống lành mạnh.',
    },
  },

  // ============================================================
  // CỰ MÔN (Giant Gate/Speech Star)
  // ============================================================
  'Cự Môn': {
    'Mệnh': {
      'Miếu': 'Cự Môn Miếu tại Mệnh cho khả năng ăn nói giỏi, biện luận sắc bén. Phù hợp luật sư, nhà báo, thầy giáo, MC. Bạn có thể thuyết phục bất kỳ ai bằng lời nói. Tuy nhiên đôi khi quá thẳng thắn gây mất lòng.',
      'Bình': 'Cự Môn Bình tại Mệnh cho thấy bạn hay tranh luận, nói nhiều, đôi khi gây mâu thuẫn không cần thiết. Có tài ăn nói nhưng cần kiểm soát lời nói tốt hơn.',
      'Hãm': 'Cự Môn Hãm tại Mệnh khiến cuộc đời nhiều thị phi. Hay gặp rắc rối do lời nói, bị gièm pha hoặc phải đối mặt với pháp lý. Cuộc sống cô đơn nếu không biết kiềm chế miệng lưỡi.',
    },
    'Quan Lộc': {
      'Miếu': 'Cự Môn Miếu ở Quan Lộc rất phù hợp nghề luật sư, MC, giáo viên, tư vấn, bán hàng. Khả năng thuyết trình xuất sắc giúp sự nghiệp thành công. Được khách hàng và đối tác tin tưởng.',
      'Bình': 'Cự Môn Bình ở Quan Lộc cho sự nghiệp liên quan giao tiếp nhưng hay gặp hiểu lầm. Cần thận trọng lời nói trong công việc. Tránh tranh cãi với đồng nghiệp.',
      'Hãm': 'Cự Môn Hãm ở Quan Lộc cảnh báo thị phi công sở. Dễ bị kiện tụng, mâu thuẫn với cấp trên. Nên tránh ngành truyền thông, luật nếu Cự Môn hãm.',
    },
    'Tài Bạch': {
      'Miếu': 'Cự Môn Miếu tại Tài Bạch giúp kiếm tiền bằng miệng — bán hàng, tư vấn, giảng dạy. Thu nhập tốt từ nghề giao tiếp. Biết cách đàm phán và thương lượng.',
      'Bình': 'Cự Môn Bình tại Tài Bạch cho thu nhập từ công việc giao tiếp nhưng hay gặp tranh chấp tài chính. Cần hợp đồng rõ ràng trong mọi giao dịch.',
      'Hãm': 'Cự Môn Hãm tại Tài Bạch khiến tài chính nhiều tranh chấp, kiện tụng. Mất tiền vì miệng, vì thị phi. Tuyệt đối tránh bảo lãnh, cho vay.',
    },
    'Phu Thê': {
      'Miếu': 'Cự Môn Miếu tại Phu Thê cho bạn đời ăn nói giỏi, thông minh. Đời sống tình cảm sôi nổi, hay trao đổi và tranh luận nhưng không ác ý. Mối quan hệ thú vị.',
      'Bình': 'Cự Môn Bình tại Phu Thê cho mối quan hệ hay cãi vã. Bạn đời thẳng tính, nói nhiều. Cần kiên nhẫn và học cách lắng nghe để giảm mâu thuẫn.',
      'Hãm': 'Cự Môn Hãm tại Phu Thê rất bất lợi. Hôn nhân nhiều tranh cãi, thị phi. Bạn đời hay nói lời tổn thương. Dễ ly hôn nếu không kiểm soát lời nói.',
    },
    'Tật Ách': {
      'Miếu': 'Cự Môn Miếu tại Tật Ách cho sức khỏe tương đối tốt. Cần chú ý miệng, họng, răng, dạ dày. Tránh ăn cay nóng và hút thuốc.',
      'Bình': 'Cự Môn Bình tại Tật Ách hay bị viêm họng, đau dạ dày, vấn đề tiêu hóa. Cần chú ý ăn uống và khám nha khoa định kỳ.',
      'Hãm': 'Cự Môn Hãm tại Tật Ách cảnh báo bệnh về miệng, họng, dạ dày, thực quản. Dễ mắc bệnh mạn tính liên quan tiêu hóa. Cần ăn uống lành mạnh, tránh rượu bia.',
    },
  },

  // ============================================================
  // THIÊN TƯỚNG (Celestial Minister Star)
  // ============================================================
  'Thiên Tướng': {
    'Mệnh': {
      'Miếu': 'Thiên Tướng Miếu tại Mệnh cho tính cách ngay thẳng, hay giúp đỡ người khác, được quý nhân phù trợ. Phù hợp nghề nhân sự, hành chính, ngoại giao. Cuộc đời ít tai họa, có người che chở.',
      'Bình': 'Thiên Tướng Bình tại Mệnh cho tính cách tốt bụng nhưng hay bị lợi dụng. Giúp người nhiều mà bản thân ít được báo đáp. Cần biết chọn lọc người để giúp.',
      'Hãm': 'Thiên Tướng Hãm tại Mệnh khiến bạn thiếu chủ kiến, dễ bị ảnh hưởng bởi người khác. Cuộc sống phụ thuộc, khó tự chủ. Cần rèn luyện bản lĩnh và sự độc lập.',
    },
    'Quan Lộc': {
      'Miếu': 'Thiên Tướng Miếu ở Quan Lộc phù hợp nghề nhân sự, hành chính, ngoại giao, xã hội. Sự nghiệp phát triển nhờ quan hệ tốt. Được cấp trên và đồng nghiệp ủng hộ.',
      'Bình': 'Thiên Tướng Bình ở Quan Lộc cho sự nghiệp ổn định nhưng không nổi bật. Làm tốt vai trò hỗ trợ, phụ tá. Khó làm lãnh đạo chính.',
      'Hãm': 'Thiên Tướng Hãm ở Quan Lộc khiến sự nghiệp phụ thuộc người khác quá nhiều. Dễ bị lợi dụng trong công việc. Cần tự lập và có chính kiến.',
    },
    'Tài Bạch': {
      'Miếu': 'Thiên Tướng Miếu tại Tài Bạch cho tài chính ổn định nhờ quý nhân. Hay được giúp đỡ, hỗ trợ tài chính từ người khác. Phù hợp làm đại lý, nhượng quyền.',
      'Bình': 'Thiên Tướng Bình tại Tài Bạch cho thu nhập đủ sống nhưng phụ thuộc nhiều vào hoàn cảnh. Tài chính ổn nhưng ít đột phá.',
      'Hãm': 'Thiên Tướng Hãm tại Tài Bạch khiến tài chính phụ thuộc người khác, dễ bị lừa. Hay cho vay mà không đòi được. Cần tự chủ tài chính.',
    },
    'Phu Thê': {
      'Miếu': 'Thiên Tướng Miếu tại Phu Thê rất tốt. Bạn đời hiền lành, đáng tin cậy, hay giúp đỡ gia đình. Hôn nhân ổn định, bền vững.',
      'Bình': 'Thiên Tướng Bình tại Phu Thê cho bạn đời tốt bụng nhưng thiếu quyết đoán. Mối quan hệ bình lặng, ít sóng gió nhưng cũng ít hứng thú.',
      'Hãm': 'Thiên Tướng Hãm tại Phu Thê cho bạn đời phụ thuộc, thiếu tự lập. Có thể gánh nặng tài chính từ đối phương. Cần tìm bạn đời tự chủ.',
    },
    'Tật Ách': {
      'Miếu': 'Thiên Tướng Miếu tại Tật Ách cho sức khỏe tốt, ít bệnh. Có quý nhân phù trợ khi ốm đau. Cần chú ý da và hệ miễn dịch.',
      'Bình': 'Thiên Tướng Bình tại Tật Ách cho sức khỏe tạm ổn. Hay bị dị ứng, mẩn ngứa. Cần tránh thực phẩm gây dị ứng.',
      'Hãm': 'Thiên Tướng Hãm tại Tật Ách cho sức khỏe yếu, dễ mắc bệnh do môi trường. Hay bị lây bệnh từ người khác. Cần tăng cường miễn dịch.',
    },
  },

  // ============================================================
  // THIÊN LƯƠNG (Celestial Beam/Virtue Star)
  // ============================================================
  'Thiên Lương': {
    'Mệnh': {
      'Miếu': 'Thiên Lương Miếu tại Mệnh cho tính cách đức độ, trường thọ, hay giúp đỡ người khác. Được mọi người kính trọng và tin tưởng. Phù hợp nghề giáo dục, y tế, tư vấn, từ thiện.',
      'Bình': 'Thiên Lương Bình tại Mệnh cho tính cách tốt bụng nhưng lo lắng nhiều, hay suy nghĩ cho người khác quá mức. Dễ bị stress vì lo lắng. Cần biết chăm sóc bản thân.',
      'Hãm': 'Thiên Lương Hãm tại Mệnh khiến cuộc đời cô đơn, vất vả. Hay phải gánh vác cho người khác mà ít được báo đáp. Sức khỏe tinh thần cần được chú ý.',
    },
    'Quan Lộc': {
      'Miếu': 'Thiên Lương Miếu ở Quan Lộc rất phù hợp nghề y tế, giáo dục, từ thiện, tôn giáo, tư vấn tâm lý. Sự nghiệp có ý nghĩa, giúp đỡ nhiều người. Được kính trọng trong ngành.',
      'Bình': 'Thiên Lương Bình ở Quan Lộc cho sự nghiệp phục vụ xã hội, thu nhập vừa phải. Công việc đạo đức nhưng ít cơ hội thăng tiến lớn.',
      'Hãm': 'Thiên Lương Hãm ở Quan Lộc khiến sự nghiệp vất vả, phải gánh vác nhiều. Làm việc nhiều nhưng ít được công nhận. Cần tìm môi trường đánh giá đúng giá trị.',
    },
    'Tài Bạch': {
      'Miếu': 'Thiên Lương Miếu tại Tài Bạch cho tài chính ổn định từ nghề phúc đức. Kiếm tiền bằng cách giúp người. Thu nhập không quá giàu nhưng bền vững, không bao giờ thiếu.',
      'Bình': 'Thiên Lương Bình tại Tài Bạch cho thu nhập vừa đủ. Hay chi tiêu cho người khác, từ thiện. Tiền bạc không dư nhưng cũng không khổ.',
      'Hãm': 'Thiên Lương Hãm tại Tài Bạch khiến tài chính khó khăn. Hay mất tiền vì giúp người sai cách. Cần học cách nói không và bảo vệ tài sản bản thân.',
    },
    'Phu Thê': {
      'Miếu': 'Thiên Lương Miếu tại Phu Thê tốt cho hôn nhân. Bạn đời đức độ, quan tâm gia đình, biết lo lắng cho mọi người. Hôn nhân bền vững, con cái hiếu thảo.',
      'Bình': 'Thiên Lương Bình tại Phu Thê cho bạn đời tốt bụng nhưng hay lo lắng quá mức. Mối quan hệ ổn nhưng thiếu thoải mái, nên giảm bớt áp lực cho nhau.',
      'Hãm': 'Thiên Lương Hãm tại Phu Thê cho bạn đời vất vả, hay phiền muộn. Hôn nhân thiếu niềm vui, nặng gánh gia đình. Cần tìm cách giải tỏa cùng nhau.',
    },
    'Tật Ách': {
      'Miếu': 'Thiên Lương Miếu tại Tật Ách rất tốt — sức khỏe bền bỉ, trường thọ. Có phúc đức bảo vệ, ít bệnh nặng. Nên duy trì lối sống lành mạnh để phát huy.',
      'Bình': 'Thiên Lương Bình tại Tật Ách cho sức khỏe tạm ổn, hay bị stress do lo lắng. Cần tập thiền, yoga và giải tỏa tinh thần.',
      'Hãm': 'Thiên Lương Hãm tại Tật Ách cho sức khỏe suy yếu, hay ốm vặt. Lo lắng kéo dài ảnh hưởng sức khỏe. Cần nghỉ ngơi và thư giãn nhiều hơn.',
    },
  },

  // ============================================================
  // THẤT SÁT (Seven Kills/Warrior Star)
  // ============================================================
  'Thất Sát': {
    'Mệnh': {
      'Miếu': 'Thất Sát Miếu tại Mệnh cho tính cách uy quyền, dũng cảm, quyết đoán. Có tài lãnh đạo kiểu quân đội, không sợ khó khăn. Phù hợp nghề quân đội, thể thao, kỹ thuật, startup.',
      'Bình': 'Thất Sát Bình tại Mệnh cho tính cách cương nghị nhưng đôi khi quá nóng nảy. Hay xung đột với người khác. Cần kiểm soát cảm xúc và sự nóng giận.',
      'Hãm': 'Thất Sát Hãm tại Mệnh cảnh báo hung bạo, hiếu chiến, hay gặp tai họa. Cuộc đời nhiều nguy hiểm. Cần kiềm chế bản thân, tránh xa bạo lực và cờ bạc.',
    },
    'Quan Lộc': {
      'Miếu': 'Thất Sát Miếu ở Quan Lộc tuyệt vời cho nghề quân đội, công an, thể thao, kỹ thuật, startup. Sự nghiệp phát triển mạnh nhờ tính quyết đoán. Không ngại cạnh tranh.',
      'Bình': 'Thất Sát Bình ở Quan Lộc cho sự nghiệp có áp lực cao. Phù hợp công việc đòi hỏi sự cạnh tranh nhưng cũng dễ kiệt sức. Cần biết nghỉ ngơi.',
      'Hãm': 'Thất Sát Hãm ở Quan Lộc khiến sự nghiệp đầy rủi ro. Hay gặp tai nạn lao động, xung đột nơi làm việc. Nên tránh nghề nguy hiểm khi Thất Sát hãm.',
    },
    'Tài Bạch': {
      'Miếu': 'Thất Sát Miếu tại Tài Bạch giúp kiếm tiền bằng sự quyết đoán và cạnh tranh. Thu nhập cao từ nghề mạo hiểm. Đầu tư mạnh tay nhưng hiệu quả.',
      'Bình': 'Thất Sát Bình tại Tài Bạch cho thu nhập không ổn định, lúc nhiều lúc ít. Tiền đến nhanh nhưng cũng đi nhanh. Cần kỷ luật tài chính.',
      'Hãm': 'Thất Sát Hãm tại Tài Bạch cảnh báo tài chính hao tổn nghiêm trọng. Dễ mất tiền do liều lĩnh, phá sản. Tuyệt đối tránh đầu cơ và cờ bạc.',
    },
    'Phu Thê': {
      'Miếu': 'Thất Sát Miếu tại Phu Thê cho bạn đời mạnh mẽ, quyết đoán, có sự nghiệp riêng. Mối quan hệ có tính cạnh tranh nhưng đầy năng lượng. Cần tôn trọng không gian riêng.',
      'Bình': 'Thất Sát Bình tại Phu Thê cho mối quan hệ nhiều sóng gió. Bạn đời nóng tính, hay xung đột. Cần kiên nhẫn và bao dung để giữ gìn hôn nhân.',
      'Hãm': 'Thất Sát Hãm tại Phu Thê rất bất lợi. Hôn nhân nhiều bạo lực (lời nói hoặc hành động). Dễ ly hôn. Kết hôn rất muộn hoặc chọn bạn đời lớn tuổi hơn.',
    },
    'Tật Ách': {
      'Miếu': 'Thất Sát Miếu tại Tật Ách cho thể chất mạnh mẽ nhưng hay bị thương. Cần chú ý tai nạn và chấn thương. Tập võ thuật, thể thao có lợi.',
      'Bình': 'Thất Sát Bình tại Tật Ách hay bị chấn thương, bầm tím, đau nhức. Cần thận trọng khi tham gia thể thao và lái xe.',
      'Hãm': 'Thất Sát Hãm tại Tật Ách cảnh báo tai nạn nghiêm trọng, phẫu thuật. Đặc biệt nguy hiểm khi lái xe nhanh. Cần mua bảo hiểm và cẩn thận mọi lúc.',
    },
  },

  // ============================================================
  // PHÁ QUÂN (Army Breaker/Revolutionary Star)
  // ============================================================
  'Phá Quân': {
    'Mệnh': {
      'Miếu': 'Phá Quân Miếu tại Mệnh cho tính cách dũng cảm, dám phá vỡ lối mòn, đổi mới sáng tạo. Có tài kiến thiết, thích thử thách. Phù hợp khởi nghiệp, đổi mới, công nghệ.',
      'Bình': 'Phá Quân Bình tại Mệnh cho tính cách hay thay đổi, khó ổn định. Cuộc sống nhiều biến động. Có năng lực nhưng thiếu kiên nhẫn. Cần học cách kiên trì.',
      'Hãm': 'Phá Quân Hãm tại Mệnh khiến cuộc đời thăng trầm dữ dội. Phá hoại nhiều hơn xây dựng, hay gây rắc rối cho bản thân và người khác. Cần rèn luyện tính kiên nhẫn.',
    },
    'Quan Lộc': {
      'Miếu': 'Phá Quân Miếu ở Quan Lộc tuyệt vời cho khởi nghiệp, đổi mới, công nghệ, tái cấu trúc. Bạn có khả năng phá bỏ cái cũ và xây dựng cái mới. Sự nghiệp nhiều lần thay đổi nhưng ngày càng tốt.',
      'Bình': 'Phá Quân Bình ở Quan Lộc cho sự nghiệp hay thay đổi, khó ổn định. Nhiều dự án bắt đầu nhưng ít hoàn thành. Cần tập trung vào một hướng.',
      'Hãm': 'Phá Quân Hãm ở Quan Lộc cảnh báo sự nghiệp thất bại liên tục. Bắt đầu nhiều nhưng không thành. Nên tránh khởi nghiệp, tìm công việc ổn định.',
    },
    'Tài Bạch': {
      'Miếu': 'Phá Quân Miếu tại Tài Bạch cho tài chính nhiều biến động nhưng tổng thể tốt. Kiếm tiền bằng cách phá vỡ thị trường, đổi mới. Đầu tư mạo hiểm nhưng có lãi.',
      'Bình': 'Phá Quân Bình tại Tài Bạch cho tài chính lên xuống thất thường. Lúc giàu lúc nghèo, khó ổn định. Cần quỹ dự phòng và đa dạng hóa thu nhập.',
      'Hãm': 'Phá Quân Hãm tại Tài Bạch cảnh báo phá sản, nợ nần. Tiêu tiền không kiểm soát, đầu tư thua lỗ liên tục. Cần có người quản lý tài chính giúp.',
    },
    'Phu Thê': {
      'Miếu': 'Phá Quân Miếu tại Phu Thê cho bạn đời cá tính mạnh, năng động, thích thay đổi. Đời sống tình cảm phong phú nhưng nhiều biến động. Mối quan hệ luôn mới mẻ.',
      'Bình': 'Phá Quân Bình tại Phu Thê cho hôn nhân nhiều thay đổi. Bạn đời hay thay đổi ý kiến, kế hoạch. Cần nhẫn nại và linh hoạt.',
      'Hãm': 'Phá Quân Hãm tại Phu Thê rất bất ổn. Hôn nhân hay đổ vỡ, dễ ly hôn. Bạn đời phá hoại hơn xây dựng. Kết hôn muộn hoặc chọn người ổn định sẽ tốt hơn.',
    },
    'Tật Ách': {
      'Miếu': 'Phá Quân Miếu tại Tật Ách cho sức khỏe biến động nhưng phục hồi nhanh. Cần chú ý hệ tiêu hóa và xương. Tập thể dục giữ sức bền.',
      'Bình': 'Phá Quân Bình tại Tật Ách hay bị vấn đề tiêu hóa, đau lưng. Sức khỏe thay đổi theo mùa. Cần chú ý ăn uống điều độ.',
      'Hãm': 'Phá Quân Hãm tại Tật Ách cảnh báo phẫu thuật, tai nạn, bệnh nặng đột ngột. Cần khám sức khỏe định kỳ và mua bảo hiểm y tế.',
    },
  },
};

/**
 * Get interpretation for a star at a specific palace with specific brightness.
 * Normalizes brightness: Vượng → Miếu, Đắc → Bình.
 * Falls back to null if no specific rule exists.
 */
export function getStarInterpretation(starName: string, palaceName: string, brightness: string): string | null {
  let key = brightness;
  if (brightness === 'Vượng') key = 'Miếu';
  if (brightness === 'Đắc') key = 'Bình';
  return INTERPRETATION_RULES[starName]?.[palaceName]?.[key] || null;
}

/**
 * Advice generation mappings based on palace ratings.
 */
export const PALACE_ADVICE: Record<string, { good: string; bad: string }> = {
  'Mệnh': {
    good: 'Bạn có nền tảng bản thân tốt. Hãy phát huy ưu điểm, tự tin thể hiện bản thân và theo đuổi mục tiêu lớn.',
    bad: 'Bản thân còn nhiều điểm cần cải thiện. Hãy rèn luyện kỷ luật, học hỏi không ngừng và tìm quý nhân giúp đỡ.',
  },
  'Quan Lộc': {
    good: 'Sự nghiệp có nền tảng tốt, nên theo đuổi mục tiêu lớn, tự tin phát triển. Đặc biệt thuận lợi khi làm lãnh đạo hoặc tự kinh doanh.',
    bad: 'Sự nghiệp gặp thử thách, nên thận trọng đổi việc, tập trung chuyên môn. Làm việc chăm chỉ và kiên nhẫn sẽ dần cải thiện.',
  },
  'Tài Bạch': {
    good: 'Tài chính thuận lợi, có thể đầu tư và mở rộng. Biết cách tích lũy và quản lý tài sản hiệu quả.',
    bad: 'Cần kiểm soát chi tiêu, tránh đầu cơ mạo hiểm, tiết kiệm là ưu tiên. Nên có quỹ dự phòng ít nhất 6 tháng chi tiêu.',
  },
  'Phu Thê': {
    good: 'Tình cảm thuận lợi, hôn nhân bền vững. Nên trân trọng mối quan hệ và cùng nhau phát triển.',
    bad: 'Hôn nhân cần kiên nhẫn, tránh nóng vội. Hiểu và thông cảm cho nhau. Kết hôn muộn có thể tốt hơn.',
  },
  'Tật Ách': {
    good: 'Sức khỏe tốt, cần duy trì lối sống lành mạnh để phát huy. Tập thể dục đều đặn và ăn uống khoa học.',
    bad: 'Cần chú ý sức khỏe, khám định kỳ, tránh thức khuya và stress. Đầu tư cho sức khỏe là đầu tư khôn ngoan nhất.',
  },
  'Phụ Mẫu': {
    good: 'Quan hệ với cha mẹ tốt đẹp, được gia đình hỗ trợ. Nên giữ gìn mối quan hệ và biết ơn nguồn cội.',
    bad: 'Quan hệ với cha mẹ có khoảng cách, cần chủ động gần gũi hơn. Hiếu thảo không chỉ bằng vật chất mà còn bằng thời gian.',
  },
  'Huynh Đệ': {
    good: 'Anh chị em hòa thuận, bạn bè tốt. Có thể hợp tác kinh doanh với anh em.',
    bad: 'Cần cẩn thận trong quan hệ anh em, bạn bè. Tránh hùn vốn kinh doanh với người thân để giữ tình cảm.',
  },
  'Tử Tức': {
    good: 'Con cái hiếu thảo, có triển vọng tốt. Nên đầu tư cho giáo dục và định hướng nghề nghiệp sớm.',
    bad: 'Con cái cần nhiều quan tâm và hướng dẫn hơn. Kiên nhẫn trong giáo dục, không nên quá áp đặt.',
  },
  'Phúc Đức': {
    good: 'Phúc đức gia đình tốt, có nền tảng vững chắc. Biết hưởng thụ cuộc sống và giữ cân bằng tinh thần.',
    bad: 'Cần tu dưỡng đạo đức, làm nhiều việc thiện để tích phúc. Thiền định và thực hành tâm linh sẽ giúp cải thiện.',
  },
};

/**
 * Career suggestions mapped by dominant main star.
 */
export const CAREER_MAP: Record<string, string[]> = {
  'Tử Vi': ['Lãnh đạo', 'Quản lý cấp cao', 'Chính trị', 'Tổ chức lớn', 'CEO'],
  'Thiên Cơ': ['Kỹ sư', 'IT/Lập trình', 'Lập kế hoạch', 'Nghiên cứu', 'Cố vấn chiến lược'],
  'Thái Dương': ['Truyền thông', 'Giáo dục', 'Chính trị', 'Ngoại giao', 'PR/Marketing'],
  'Vũ Khúc': ['Tài chính', 'Ngân hàng', 'Kế toán', 'Kinh doanh', 'Bất động sản'],
  'Thiên Đồng': ['Nghệ thuật', 'Giải trí', 'Du lịch', 'Xã hội', 'Phúc lợi'],
  'Liêm Trinh': ['Luật', 'Kế toán/Kiểm toán', 'Quân đội', 'Công an', 'Thanh tra'],
  'Thiên Phủ': ['Quản lý tài sản', 'Bất động sản', 'Ngân hàng', 'Bảo hiểm', 'Kho vận'],
  'Thái Âm': ['Bất động sản', 'Tài chính', 'Nghệ thuật', 'Thiết kế', 'Kinh doanh đêm'],
  'Tham Lang': ['Marketing', 'Sales', 'Giải trí', 'Ẩm thực', 'Du lịch', 'Sáng tạo nội dung'],
  'Cự Môn': ['Luật sư', 'MC/Dẫn chương trình', 'Giáo viên', 'Tư vấn', 'Bán hàng'],
  'Thiên Tướng': ['Nhân sự', 'Hành chính', 'Ngoại giao', 'Xã hội', 'Phụ tá quản lý'],
  'Thiên Lương': ['Y tế', 'Giáo dục', 'Từ thiện', 'Tôn giáo', 'Tư vấn tâm lý'],
  'Thất Sát': ['Quân đội', 'Thể thao', 'Kỹ thuật', 'Công nghệ', 'Startup', 'Cạnh tranh'],
  'Phá Quân': ['Khởi nghiệp', 'Đổi mới', 'Công nghệ', 'Phá cách', 'Tái cấu trúc'],
};

/**
 * Health advice based on Ngũ Hành (Five Elements) balance.
 * Keys: "{element}_{state}" where state is vuong (excess) or nhuoc (deficient).
 */
export const HEALTH_MAP: Record<string, string> = {
  'Kim_vuong': 'Kim vượng → lưu ý phổi, da, đường hô hấp, ruột già. Nên tập hít thở sâu và bảo vệ da.',
  'Kim_nhuoc': 'Kim nhược → phổi yếu, dễ viêm họng, dị ứng. Nên ăn thực phẩm màu trắng (củ cải, lê) và tập thở.',
  'Mộc_vuong': 'Mộc vượng → lưu ý gan nóng, mắt, gân cốt căng. Hạn chế rượu bia, ăn nhiều rau xanh.',
  'Mộc_nhuoc': 'Mộc nhược → gan yếu, mắt mờ, dễ stress. Nên ăn rau xanh, tập yoga, tránh thức khuya.',
  'Thủy_vuong': 'Thủy vượng → lưu ý thận, bàng quang, tai. Uống đủ nước, tránh ăn mặn quá.',
  'Thủy_nhuoc': 'Thủy nhược → thận yếu, xương khớp, đau lưng. Nên ăn đậu đen, hạt óc chó, bổ thận.',
  'Hỏa_vuong': 'Hỏa vượng → lưu ý tim, huyết áp, mất ngủ. Tránh stress, tập thiền, ăn mát.',
  'Hỏa_nhuoc': 'Hỏa nhược → tim mạch yếu, huyết áp thấp, thiếu máu. Tập cardio nhẹ, ăn táo đỏ, kỷ tử.',
  'Thổ_vuong': 'Thổ vượng → lưu ý dạ dày, tỳ vị, tiêu hóa, tiểu đường. Ăn chậm nhai kỹ, tránh đồ ngọt.',
  'Thổ_nhuoc': 'Thổ nhược → tiêu hóa kém, hấp thu dinh dưỡng yếu. Ăn cháo, thực phẩm dễ tiêu, tránh đồ lạnh.',
};

/**
 * Templates for tam hợp / đối cung influence descriptions.
 */
export const CHIEU_TEMPLATES: Record<string, string> = {
  'Tử Vi': 'Tử Vi chiếu vào → tăng uy quyền, được tôn trọng, có quý nhân phù trợ',
  'Thiên Cơ': 'Thiên Cơ chiếu vào → tăng trí tuệ, khả năng lập kế hoạch, tính linh hoạt',
  'Thái Dương': 'Thái Dương chiếu vào → sáng sủa, được nhiều người giúp đỡ, tăng danh tiếng',
  'Vũ Khúc': 'Vũ Khúc chiếu vào → tăng khả năng tài chính, tính quyết đoán',
  'Thiên Đồng': 'Thiên Đồng chiếu vào → nhẹ nhàng hơn, thiên về hưởng thụ, giảm áp lực',
  'Liêm Trinh': 'Liêm Trinh chiếu vào → tăng tính kỷ luật, tuy nhiên cũng thêm phức tạp',
  'Thiên Phủ': 'Thiên Phủ chiếu vào → ổn định hơn, tăng tài lộc, có kho tàng hỗ trợ',
  'Thái Âm': 'Thái Âm chiếu vào → thuận lợi về tài chính, bất động sản, tăng tính nhạy cảm',
  'Tham Lang': 'Tham Lang chiếu vào → mở rộng quan hệ xã hội, tăng sáng tạo',
  'Cự Môn': 'Cự Môn chiếu vào → tăng khả năng giao tiếp nhưng cũng thêm thị phi',
  'Thiên Tướng': 'Thiên Tướng chiếu vào → được quý nhân hỗ trợ, tăng may mắn',
  'Thiên Lương': 'Thiên Lương chiếu vào → tăng phúc đức, được che chở, trường thọ',
  'Thất Sát': 'Thất Sát chiếu vào → tăng tính cạnh tranh, áp lực nhưng cũng tạo động lực phát triển',
  'Phá Quân': 'Phá Quân chiếu vào → hay thay đổi, phá cách, không ngại đổi mới',
};

/**
 * Maps interpretation sections to their primary and secondary palaces.
 */
export const SECTION_PALACES: Record<string, { primary: string; secondary: string[] }> = {
  'Tính Cách': { primary: 'Mệnh', secondary: [] },
  'Sự Nghiệp': { primary: 'Quan Lộc', secondary: ['Mệnh', 'Thiên Di'] },
  'Tài Lộc': { primary: 'Tài Bạch', secondary: ['Điền Trạch', 'Phúc Đức'] },
  'Tình Duyên': { primary: 'Phu Thê', secondary: ['Tử Tức'] },
  'Sức Khỏe': { primary: 'Tật Ách', secondary: ['Mệnh'] },
  'Gia Đình': { primary: 'Phụ Mẫu', secondary: ['Huynh Đệ', 'Tử Tức'] },
};
