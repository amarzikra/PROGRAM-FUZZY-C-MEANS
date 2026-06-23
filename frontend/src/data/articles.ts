export interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
  imageUrl: string;
}

export const articlesData: Article[] = [
  {
    id: "1",
    title: "Apa Bedanya Ozempic dengan Obat Diabetes Lain?",
    category: "Diabetes",
    date: "21 Des 2024",
    excerpt: "Ingin tahu lebih banyak tentang Ozempic? Konsultasikan dengan dr. Dyah Novita Anggraini. Artikel ini akan membahas manfaat, risiko, dan perbedaan Ozempic dengan obat diabetes lainnya. Jangan lewatkan!",
    content: "Ozempic belakangan ini sangat populer, bukan hanya sebagai obat diabetes, tetapi juga sering disinggung terkait efek samping penurun berat badan. Secara medis, Ozempic masuk ke dalam golongan obat GLP-1 receptor agonist yang berfungsi merangsang pankreas melepaskan lebih banyak insulin ketika kadar gula darah tinggi. \\n\\nBerbeda dengan obat oral klasik seperti Metformin yang bekerja dengan mengurangi produksi glukosa di hati, Ozempic bekerja langsung menargetkan hormon inkretin. Konsultasi rutin dengan dokter sangat penting untuk memantau efek samping seperti mual atau masalah pencernaan lainnya.",
    imageUrl: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "2",
    title: "Alasan Diabetes Tipe 2 Dikenal Sebagai Diabetes Lifestyle",
    category: "Diabetes",
    date: "17 Des 2024",
    excerpt: "Diabetes tipe 2 dikenal sebagai diabetes lifestyle karena sering terkait gaya hidup. Pelajari penyebab, faktor risiko, dan tips mengelola kondisi ini untuk hidup lebih sehat dan seimbang.",
    content: "Penyebutan 'Diabetes Lifestyle' pada tipe 2 didasari oleh fakta bahwa mayoritas kasus sangat berkorelasi erat dengan kebiasaan hidup sehari-hari. Berbeda dengan tipe 1 yang bersifat autoimun sejak dini, tipe 2 umumnya berkembang akibat resistensi insulin yang dipicu oleh obesitas, pola makan tinggi gula dan lemak jenuh, serta minimnya aktivitas fisik (sedentary lifestyle). \\n\\nKabar baiknya, karena sangat bergantung pada gaya hidup, modifikasi pola hidup seringkali dapat membalikkan keadaan atau setidaknya mengontrol penyakit ini tanpa harus sepenuhnya bergantung pada injeksi insulin. Olahraga ringan seperti jalan cepat 30 menit sehari sangat disarankan.",
    imageUrl: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "3",
    title: "Hubungan Diabetes dan Melemahnya Fungsi Otak",
    category: "Diabetes",
    date: "30 Nov 2024",
    excerpt: "Diabetes tidak hanya memengaruhi gula darah, tapi juga kesehatan otak. Temukan fakta mengejutkan tentang hubungan keduanya dan cara menjaga fungsi otak tetap optimal.",
    content: "Hiperglikemia kronis tidak hanya merusak pembuluh darah kapiler di mata (retinopati) atau ginjal (nefropati), tetapi juga merusak pembuluh darah kecil yang menyuplai nutrisi ke otak. Kondisi ini sering dikaitkan dengan peningkatan risiko demensia vaskular dan penyakit Alzheimer. Penurunan kognitif bisa terlihat dari menurunnya daya ingat, kesulitan fokus, hingga kebingungan ringan.\\n\\nUntuk mencegahnya, pengendalian kadar HbA1c secara ketat serta menjaga tekanan darah di angka normal sangatlah esensial.",
    imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "4",
    title: "Astaxanthin Sebagai Terapi untuk Meringankan Diabetes",
    category: "Diabetes",
    date: "21 Nov 2024",
    excerpt: "Astaxanthin, antioksidan alami, jadi sorotan baru dalam dunia kesehatan. Bagaimana cara senyawa ini bantu atasi diabetes dan komplikasi? Temukan jawabannya di sini!",
    content: "Stres oksidatif merupakan salah satu dalang di balik resistensi insulin dan komplikasi diabetes. Astaxanthin, yang merupakan karotenoid pembawa warna merah pada salmon dan udang, dikenal sebagai 'Raja Antioksidan'. Beberapa studi menunjukkan bahwa asupan astaxanthin dapat membantu menekan stres oksidatif pankreas, sehingga melindungi sel-sel beta yang memproduksi insulin.\\n\\nNamun demikian, astaxanthin bukanlah pengganti obat medis, melainkan suplemen tambahan pendukung yang patut didiskusikan dengan dokter Anda.",
    imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "5",
    title: "Mana Lebih Baik, Suntik Insulin atau Obat Oral Diabetes?",
    category: "Diabetes",
    date: "16 Nov 2024",
    excerpt: "Suntik insulin dan obat diabetes sama-sama bertujuan untuk mengoptimalkan kadar gula darah penderita. Mana yang lebih efektif dan direkomendasikan?",
    content: "Tidak ada jawaban baku yang berlaku untuk semua orang, karena penentuan jenis pengobatan bergantung sepenuhnya pada tipe diabetes, durasi sakit, dan seberapa sisa fungsi pankreas. Penderita diabetes tipe 1 mutlak membutuhkan insulin eksogen karena pankreas mereka sama sekali tidak memproduksinya. \\n\\nSebaliknya, penderita diabetes tipe 2 fase awal biasanya merespon sangat baik dengan obat oral seperti Metformin. Namun, jika penyakit memburuk seiring waktu dan pankreas 'kelelahan', dokter mungkin akan mulai merekomendasikan injeksi insulin tambahan.",
    imageUrl: "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?auto=format&fit=crop&q=80&w=600"
  }
];
